import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss'],
})
export class SubscriptionFormComponent implements OnInit {
  subscriptionForm!: FormGroup;

  constructor() {}

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

    const subscriptionData = {
      ...this.subscriptionForm.value,
    };
  }
}
