import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { catchError, from, throwError } from 'rxjs';

import { UpdateSubscriber } from '../models/update-subscriber';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  private subscribersCollection = collection(this.fs, 'subscribers');

  constructor(private fs: Firestore) {}

  addSubscriber(data: UpdateSubscriber) {
    return from(addDoc(this.subscribersCollection, data)).pipe(
      catchError((err) => {
        console.error(`Error: ${err}`);
        return throwError(() => `Data insert error. Please try again`);
      })
    );
  }
}
