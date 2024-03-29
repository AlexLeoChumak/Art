import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { catchError, from, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authFirebase: Auth) {}

  login(email: string, password: string) {
    return from(
      signInWithEmailAndPassword(this.authFirebase, email, password)
    ).pipe(
      tap((responce) => {
        this.setToken(responce);
      }),
      catchError((err: FirebaseError) => {
        console.error(`Error: ${err}`);
        return throwError(() => err);
      })
    );
  }

  private setToken(responce: any) {
    if (responce) {
      const expDate = new Date(
        new Date().getTime() + +responce._tokenResponse.expiresIn * 1000
      );

      localStorage.setItem('fb-token', responce._tokenResponse.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  get token(): any {
    const tokenExpiration = localStorage.getItem('fb-token-exp');
    const expDate = tokenExpiration ? new Date(tokenExpiration) : null;

    if (!expDate || new Date() > expDate) {
      this.logout();
      return null;
    }

    const token = localStorage.getItem('fb-token');
    return token ? token : null;
  }

  logout() {
    return from(this.authFirebase.signOut()).pipe(
      tap(() => {
        this.setToken(null);
      }),
      catchError((err) => {
        console.error(`Error: ${err}`);
        return throwError(() => err);
      })
    );
  }
}
