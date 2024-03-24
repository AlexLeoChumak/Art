import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, switchMap, takeUntil, throwError } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.scss'],
})
export class SingleCategoryComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  categoryPosts!: Post[];
  categoryDataFromParams!: Params;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((data) => {
          this.categoryDataFromParams = data;

          return this.postsService
            .loadCategoryPosts(data['id'])
            .pipe(catchError((err) => throwError(() => err)));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (data) => {
          this.categoryPosts = data;
        },
        error: (err) => this.toastr.error(err),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
