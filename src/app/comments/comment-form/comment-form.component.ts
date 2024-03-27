import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Subscription,
  catchError,
  map,
  mergeAll,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit, OnDestroy {
  private saveCommentSub!: Subscription;
  private queryParamsSub!: Subscription;
  commentForm!: FormGroup;
  postId!: string;

  @Input() idComment!: string;

  constructor(
    private commentsService: CommentsService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  submit() {
    if (this.commentForm.invalid) {
      return;
    }

    if (this.idComment) {
      this.commentsService
        .loadCommentById('id', this.idComment)
        .pipe(
          take(1),
          switchMap((data: Comment[]) => {
            return data.map((comment) => {
              comment.replyComments.push(this.commentForm.value.comment);
              return comment;
            });
          }),
          switchMap((data) =>
            this.commentsService.updateCommentToCollection(data.id, data)
          )
        )
        .subscribe();
    } else {
      this.queryParamsSub = this.route.params
        .pipe(
          catchError((err) => {
            console.error(`Error getting query parameters:  ${err}`);
            return of({});
          })
        )
        .subscribe((params: Params) => {
          if (Object.keys(params).length === 0) {
            return;
          }

          params['id'] ? (this.postId = params['id']) : null;
        });

      const comment = {
        ...this.commentForm.value,
        postId: this.postId,
        createdAt: new Date().getTime(),
        isVisibleReplyCommentForm: false,
        isVisibleReplyComments: false,
        replyComments: [],
      };

      this.saveCommentSub = this.commentsService
        .saveCommentToCollection(comment)
        .pipe(catchError((err) => throwError(() => err)))
        .subscribe({
          next: () => {
            this.commentForm.reset();
            this.toastr.success('Comments added successfully');
          },
          error: (err) => {
            this.toastr.error(err);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.saveCommentSub ? this.saveCommentSub.unsubscribe() : null;
    this.queryParamsSub ? this.queryParamsSub.unsubscribe() : null;
  }
}
