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
        next: (data) => {
          this.featuredPosts = data;
        },
        error: (err) => {
          this.toastr.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.loadFeaturedPostsSub) {
      this.loadFeaturedPostsSub.unsubscribe();
    }
    if (this.loadLatestPostsSub) {
      this.loadLatestPostsSub.unsubscribe();
    }
  }
}
