import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private loadFeaturedPostsSub!: Subscription;
  private loadLatestPostsSub!: Subscription;
  allPosts!: Post[];
  featuredPosts!: Post[];
  latestPosts!: Post[];
  isLoading: boolean = true;

  constructor(
    private postsService: PostsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedPostsSub = this.postsService
      .loadFeaturedPosts()
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data: Post[]) => {
          this.featuredPosts = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error(err);
          this.isLoading = false;
        },
      });

    this.loadLatestPostsSub = this.postsService
      .loadLatestPosts()
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data: Post[]) => {
          this.latestPosts = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error(err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.loadFeaturedPostsSub ? this.loadFeaturedPostsSub.unsubscribe() : null;
    this.loadLatestPostsSub ? this.loadLatestPostsSub.unsubscribe() : null;
  }
}
