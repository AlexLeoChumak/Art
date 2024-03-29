import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { catchError, from, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authFirebase: Auth, private fs: Firestore) {}

  signUp(name: string, email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this.authFirebase, email, password)
    ).pipe(
      tap((responce) => {
        this.setToken(responce);
      }),
      switchMap((responce) => {
        const user = {
          name,
          email: responce.user.email,
          id: responce.user.uid,
        };

        return addDoc(collection(this.fs, 'users'), user);
      }),
      catchError((err: FirebaseError) => {
        console.error(`Error: ${err}`);
        return throwError(() => err);
      })
    );
  }

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
