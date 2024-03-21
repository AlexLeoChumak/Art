import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  loadPostsSub!: Subscription;

  constructor(
    private postsService: PostsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPostsSub = this.postsService
      .loadPosts()
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          this.toastr.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.loadPostsSub) {
      this.loadPostsSub.unsubscribe();
    }
  }
}
