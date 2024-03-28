import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categoriesCollection = collection(this.fs, 'categories');

  constructor(private fs: Firestore) {}

  loadData(): Observable<Category[]> {
    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(
        this.categoriesCollection,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          observer.next(data);
        },
        (error) => {
          console.error(`Error: ${error}`);
          observer.error(
            'An error occurred while loading data. Please try again'
          );
        }
      );

      return () => {
        unsubscribe();
      };
    });
  }
}
