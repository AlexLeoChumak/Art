import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError, takeUntil, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  submitted: boolean = false;
  signUpForm!: FormGroup<any>;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private inputService: InputService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    if (this.signUpForm.invalid) {
      return;
    }

    this.submitted = true;
    const { name, email, password } = this.signUpForm.value;

    this.authService
      .signUp(name, email, password)
      .pipe(
        catchError((err) => throwError(() => err)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.toastr.success('You have successfully registered');
          this.signUpForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.toastr.error(err);
          this.submitted = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
