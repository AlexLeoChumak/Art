import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {
  Observable,
  Subscriber,
  catchError,
  from,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authFirebase: Auth, private fs: Firestore) {}

  signUp(name: string, email: string, password: string) {
    let user: User = {
      name,
      email,
      password,
      id: '',
      uid: '',
    };

    const docRef = doc(collection(this.fs, 'users'));
    user.id = docRef.id;

    return from(
      createUserWithEmailAndPassword(this.authFirebase, email, password)
    ).pipe(
      tap((responce) => {
        this.setToken(responce);
      }),
      switchMap((responce) => {
        user.uid = responce.user.uid;

        return setDoc(docRef, user);
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

  getUserData(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.authFirebase.onAuthStateChanged((user) => {
        try {
          if (user && user.uid) {
            const userQuery = query(
              collection(this.fs, 'users'),
              where('uid', '==', user.uid)
            );

            const userCollection = collectionData(userQuery);

            observer.next(
              userCollection.pipe(
                map((users) => users[0]),
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
    //для сервисов, гвардов
    return !!this.token;
  }

  isAuthenticatedObservable() {
    // для компонентов
    return new Observable((observer) => {
      this.authFirebase.onAuthStateChanged(
        (user) => {
          if (user) {
            observer.next(true);
          } else {
            observer.next(false);
          }
        },
        (error) => {
          console.error(error);
          observer.next(false);
        }
      );
    });
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
