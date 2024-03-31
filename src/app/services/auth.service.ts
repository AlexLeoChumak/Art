import { Injectable, WritableSignal, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Observable,
  Subscriber,
  catchError,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

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
          password,
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

  getUserData() {
    return new Observable((observer: Subscriber<any>) => {
      this.authFirebase.onAuthStateChanged((user) => {
        try {
          if (user && user.uid) {
            const userQuery = query(
              collection(this.fs, 'users'),
              where('id', '==', user.uid)
            );

            const userCollection = collectionData(userQuery);

            observer.next(
              userCollection.pipe(
                map((users) => users[0]), // Извлекаем первый объект из массива
                catchError((err: FirebaseError) => {
                  console.error(`Error: ${err}`);
                  return throwError(() => err);
                })
              )
            );
          }
        } catch (err) {
          console.error(`Error: ${err}`);
          observer.error(err);
        }
      });
    }).pipe(switchMap((userObservable) => userObservable));
  }

  private setToken(responce: any) {
    if (responce) {
      const expDate = new Date(
        new Date().getTime() + +responce._tokenResponse.expiresIn * 1000
      );

      localStorage.setItem('fb-token', btoa(responce._tokenResponse.idToken));
      localStorage.setItem('fb-token-exp', btoa(expDate.toString()));
    } else {
      localStorage.clear();
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  get token(): any {
    const tokenExpiration = localStorage.getItem('fb-token-exp');
    const expDate = tokenExpiration ? new Date(atob(tokenExpiration)) : null;

    if (!expDate || new Date() > expDate) {
      this.logout();
      return null;
    }

    const token = localStorage.getItem('fb-token');
    return token ? atob(token) : null;
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
