import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError, throwError } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

import { UpdateSubscriber } from '../models/update-subscriber';
import { SubscribersService } from '../services/subscribers.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss'],
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {
  private addSubscriberSub!: Subscription;
  private getUserDataSub!: Subscription;
  subscriptionForm!: FormGroup;
  submitted: boolean = false;

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

    this.submitted = true;
    const subscriptionFormData: UpdateSubscriber = {
      ...this.subscriptionForm.value,
    };

    this.addSubscriberSub = this.subscribersService
      .addSubscriber(subscriptionFormData)
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        next: (data) => {
          this.subscriptionForm.reset();
          this.submitted = false;

          if (data instanceof DocumentReference) {
            this.toastr.success('You have successfully subscribed to updates');
          } else {
            this.toastr.warning(data);
          }
        },

        error: (err) => {
          this.toastr.error(err), (this.submitted = false);
        },
      });
  }

  ngOnDestroy(): void {
    this.addSubscriberSub ? this.addSubscriberSub.unsubscribe() : null;
    this.getUserDataSub ? this.getUserDataSub.unsubscribe() : null;
  }
}
