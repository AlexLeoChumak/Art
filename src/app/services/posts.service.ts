import { Injectable } from '@angular/core';
import {
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable, Subscriber, finalize } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  categoriesCollection = collection(this.fs, 'posts');

  constructor(private fs: Firestore) {}

  loadPosts(): Observable<Post[]> {
    // метод загружает все посты из коллекции Firestore
    let unsubscribe: () => void;

    return new Observable((observer: Subscriber<Post[]>) => {
      unsubscribe = onSnapshot(
        this.categoriesCollection,
        (snapshot) => {
          const data = snapshot.docs.map(
            (docSnapshot: DocumentSnapshot<any>) => {
              const docData = docSnapshot.data();
              const id = docSnapshot.id;

              return docData ? { id, ...docData } : null;
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
