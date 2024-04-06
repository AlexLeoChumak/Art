import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, throwError } from 'rxjs';

import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private getStorageSub!: Subscription;
  private logoutSub!: Subscription;
  private getUserDataSub!: Subscription;
  user!: User;
  isAuth!: boolean;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getUserDataSub = this.authService
      .getUserData()
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        next: (user: User) => {
          this.user = user;
          this.isAuth = this.authService.isAuthenticated();
        },
        error: (err) => console.error(err),
      });

    this.getStorageSub = this.storageService.getStorage().subscribe((res) => {
      res ? this.logout() : null;
    });
  }

  logout() {
    this.logoutSub = this.authService
      .logout()
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          this.isAuth = this.authService.isAuthenticated();
          this.toastr.success('Logout successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.getUserDataSub ? this.getUserDataSub.unsubscribe() : null;
    this.getStorageSub ? this.getStorageSub.unsubscribe() : null;
    this.logoutSub ? this.logoutSub.unsubscribe() : null;
  }
}
