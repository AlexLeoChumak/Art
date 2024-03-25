import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateSubscriber } from '../models/update-subscriber';
import { SubscribersService } from '../services/subscribers.service';
import { Subscription, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss'],
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {
  private addSubscriberSub!: Subscription;
  subscriptionForm!: FormGroup;

  constructor(
    private subscribersService: SubscribersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscriptionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
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
        next: () => {
          this.subscriptionForm.reset();
          this.toastr.success('You have successfully subscribed to updates');
        },
        error: (err) => this.toastr.error(err),
      });
  }

  ngOnDestroy(): void {
    this.addSubscriberSub ? this.addSubscriberSub.unsubscribe() : null;
  }
}
