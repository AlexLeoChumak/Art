import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup<any>;
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private inputService: InputService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;
    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .pipe(catchError((err) => throwError(() => err)))
      .subscribe({
        next: () => {
          this.router.navigate([this.inputService.getInputState()()[1]]);
          this.toastr.success('Login successful');
          this.loginForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.toastr.error(err);
          this.submitted = false;
        },
      });
  }

  ngOnDestroy(): void {}
}
