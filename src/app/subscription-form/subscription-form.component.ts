import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateSubscriber } from '../models/update-subscriber';
import { SubscribersService } from '../services/subscribers.service';
import { Subscription, catchError, switchMap, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DocumentReference } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss'],
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {
  private addSubscriberSub!: Subscription;
  private getUserDataSub!: Subscription;
  subscriptionForm!: FormGroup;

  constructor(
    private subscribersService: SubscribersService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.getUserDataSub = this.authService
      .getUserData()
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        next: (user: any) => {
          if (user) {
            this.subscriptionForm.setValue({
              name: user.name,
              email: user.email,
            });
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  submit() {
    if (this.subscriptionForm.invalid) {
      return;
    }

    const subscriptionFormData: UpdateSubscriber = {
      ...this.subscriptionForm.value,
    };

    this.addSubscriberSub = this.subscribersService
      .addSubscriber(subscriptionFormData)
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        next: (data) => {
          this.subscriptionForm.reset();

          if (data instanceof DocumentReference) {
            this.toastr.success('You have successfully subscribed to updates');
          } else {
            this.toastr.warning(data);
          }
        },
        error: (err) => this.toastr.error(err),
      });
  }

  ngOnDestroy(): void {
    this.addSubscriberSub ? this.addSubscriberSub.unsubscribe() : null;
    this.getUserDataSub ? this.getUserDataSub.unsubscribe() : null;
  }
}
