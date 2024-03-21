import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, throwError } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-category-navbar',
  templateUrl: './category-navbar.component.html',
  styleUrls: ['./category-navbar.component.scss'],
})
export class CategoryNavbarComponent implements OnInit, OnDestroy {
  categoryArray!: Category[];
  loadDataSub!: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDataSub = this.categoriesService
      .loadData()
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data) => {
          this.categoryArray = data;
        },
        error: (err) => {
          this.toastr.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.loadDataSub) {
      this.loadDataSub.unsubscribe();
    }
  }
}
