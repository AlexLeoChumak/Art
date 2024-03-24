import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, switchMap, takeUntil, throwError } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  post!: DocumentData;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((data) => {
          return this.postsService
            .loadPostById(data['id'])
            .pipe(catchError((err) => throwError(() => err)));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (data) => {
          this.post = data;
        },
        error: (err) => this.toastr.error(err),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
