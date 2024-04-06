import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, switchMap, takeUntil, throwError } from 'rxjs';

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
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
        next: (data: Post[]) => {
          data.length
            ? (this.categoryPosts = data)
            : this.router.navigate(['**']);

          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error(err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
