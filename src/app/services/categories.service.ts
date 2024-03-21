import { Injectable } from '@angular/core';
import {
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable, Subscriber, finalize } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categoriesCollection = collection(this.fs, 'categories');

  constructor(private fs: Firestore) {}

  loadData(): Observable<Category[]> {
    // метод загружает все посты из коллекции Firestore
    let unsubscribe: () => void;

    return new Observable((observer: Subscriber<Category[]>) => {
      unsubscribe = onSnapshot(
        this.categoriesCollection,
        (snapshot) => {
          const data = snapshot.docs.map(
            (docSnapshot: DocumentSnapshot<any>) => {
              const data = docSnapshot.data();
              const id = docSnapshot.id;

              return data ? { id, ...data } : null;
            }
          );
          observer.next(data);
        },
        (err: FirestoreError) => {
          console.error(`Error: ${err}`);
          observer.error(
            `An error occurred while loading data. Please try again`
          );
        }
      );
    }).pipe(
      finalize(() => {
        if (unsubscribe) {
          unsubscribe();
        }
      })
    );
  }
}
