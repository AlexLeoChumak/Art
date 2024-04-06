import { Injectable } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';

import { UpdateSubscriber } from '../models/update-subscriber';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  private subscribersCollection = collection(this.fs, 'subscribers');

  constructor(private fs: Firestore) {}

  addSubscriber(
    data: UpdateSubscriber
  ): Observable<DocumentReference | string> {
    return this.checkSubscriber(data.email).pipe(
      switchMap((isUnique: boolean) => {
        if (isUnique) {
          return from(addDoc(this.subscribersCollection, data)).pipe(
            catchError((err) => {
              console.error(`Error: ${err}`);
              return throwError(() => err);
            })
          );
        } else {
          return of(`Subscriber already exists`);
        }
      })
    );
  }

  private checkSubscriber(email: string): Observable<boolean> {
    const querySubscriber = query(
      this.subscribersCollection,
      where('email', '==', email)
    );

    return from(getDocs(querySubscriber)).pipe(
      map((querySnapshot) => querySnapshot.docs.length !== 1)
    );
  }
}
