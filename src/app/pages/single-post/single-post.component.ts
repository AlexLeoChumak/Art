import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  Subscription,
  catchError,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  post!: DocumentData | Post;
  similarPosts!: Post[];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((data) => this.postsService.loadPostById(data['id'])),
        tap((data) => (data ? (this.post = data) : null)),
        switchMap((data) =>
          this.postsService.loadSimilarPosts(data['category'].categoryId)
        ),
        catchError((err) => throwError(() => err)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (data) => (data ? (this.similarPosts = data) : null),
        error: (err) => this.toastr.error(err),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
