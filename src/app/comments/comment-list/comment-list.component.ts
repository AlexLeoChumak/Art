import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, switchMap, throwError } from 'rxjs';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit, OnDestroy {
  private loadCommentsSub!: Subscription;
  comments!: any;

  constructor(
    private commentsService: CommentsService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCommentsSub = this.route.params
      .pipe(
        switchMap((params) => {
          return this.commentsService.loadCommentById('postId', params['id']);
        }),
        catchError((err) => throwError(() => err))
      )
      .subscribe({
        next: (data) => {
          data ? (this.comments = data) : null;
          console.log(data);
        },
        error: (err) => this.toastr.error(err),
      });
  }

  ngOnDestroy(): void {
    this.loadCommentsSub ? this.loadCommentsSub.unsubscribe() : null;
  }
}
