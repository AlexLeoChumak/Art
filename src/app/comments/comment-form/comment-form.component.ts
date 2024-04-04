import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Subscription,
  catchError,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { Comment } from 'src/app/models/comment';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit, OnDestroy {
  private saveCommentSub!: Subscription;
  private loadCommentSub!: Subscription;
  private queryParamsSub!: Subscription;
  private getUserDataSub!: Subscription;
  commentForm!: FormGroup;
  postId!: string;
  isVisibleReplyComments: boolean = false;
  user!: any;

  @Input() idComment!: string;

  constructor(
    private commentsService: CommentsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private inputService: InputService,
    private authGuard: AuthGuard,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });

    this.getUserDataSub = this.authService
      .getUserData()
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        next: (user) => {
          user ? (this.user = user) : null;
        },
        error: (err) => console.error(err),
      });
  }

  submit() {
    if (this.commentForm.invalid) {
      return;
    }

    if (this.idComment) {
      this.loadCommentSub = this.commentsService
        .loadCommentById('id', this.idComment)
        .pipe(
          take(1),
          switchMap((data: Comment[]) => {
            return data.map((comment) => {
              comment.replyComments.push({
                comment: this.commentForm.value.comment,
                createdAt: new Date().getTime(),
                author: this.user.name,
              });

              return comment;
            });
          }),
          switchMap((data) =>
            this.commentsService.updateCommentToCollection(data.id, data)
          ),
          catchError((err) => throwError(() => err))
        )
        .subscribe({
          next: () => console.log('Comment update successfully'),
          error: () => console.error('Comment is not update'),
        });
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
        author: this.user.name,
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

  onFocus() {
    this.inputService.setInputState([true, this.router.url]);

    const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const routerStateSnapshot = {} as RouterStateSnapshot;

    const canActivated = this.authGuard.canActivate(
      activatedRouteSnapshot,
      routerStateSnapshot
    );

    if (!canActivated) {
      this.router.navigate(['/login']);
      this.toastr.info('To leave a comment, log in or register');
      this.inputService.setInputState([false, this.router.url]);
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.saveCommentSub ? this.saveCommentSub.unsubscribe() : null;
    this.loadCommentSub ? this.loadCommentSub.unsubscribe() : null;
    this.queryParamsSub ? this.queryParamsSub.unsubscribe() : null;
    this.getUserDataSub ? this.getUserDataSub.unsubscribe() : null;
  }
}
