import { Injectable } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categoriesCollection = collection(this.fs, 'categories');

  constructor(private fs: Firestore) {}

  loadData(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(
        this.categoriesCollection,
        (snapshot) => {
          const posts = snapshot.docs.map((doc) => ({
            categoryId: doc.id,
            ...doc.data(),
          }));
          observer.next(posts);
        },
        (error) => {
          console.error(`Error: ${error}`);
          observer.error(error);
        }
      );

      return () => {
        unsubscribe();
      };
    });
  }
}
