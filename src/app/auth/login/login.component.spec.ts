import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { InputService } from 'src/app/services/input.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let toastr: ToastrService;
  let inputService: InputService;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    inputService = jasmine.createSpyObj('InputService', [
      'getInputState',
      'setInputState',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ToastrService, useValue: toastr },
        { provide: InputService, useValue: inputService },
        { provide: Router, useValue: router },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.controls['email'].setValue(null);
    component.loginForm.controls['password'].setValue(null);
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call AuthService.login if form is valid', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password');
    (authService.login as jasmine.Spy).and.returnValue(of(null));
    component.submit();
    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password');
  });

  it('should handle login error', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password');
    (authService.login as jasmine.Spy).and.returnValue(throwError('error'));
    component.submit();
    expect(toastr.error).toHaveBeenCalledWith('error');
  });
});
