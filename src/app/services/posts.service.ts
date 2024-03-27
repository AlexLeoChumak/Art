import { Injectable } from '@angular/core';
import {
  DocumentData,
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  Query,
  collection,
  doc,
  getDoc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

import {
  Observable,
  Subscriber,
  catchError,
  finalize,
  from,
  map,
  throwError,
} from 'rxjs';

import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsCollection = collection(this.fs, 'posts');

  constructor(private fs: Firestore) {}

  loadAllPosts(): Observable<Post[]> {
    return this.loadDataFromQuery(this.postsCollection);
  }

  loadPostById(id: string): Observable<DocumentData> {
    return from(getDoc(doc(this.postsCollection, id))).pipe(
      map((docSnapshot) => {
        const data = docSnapshot.data();

        if (!data) {
          return throwError(() => `No data`);
        }

        return data;
      }),
      catchError((err: FirestoreError) => {
        console.error(`Error: ${err}`);
        return throwError(() => `Data getting error. Please try again`);
      })
    );
  }

  loadFeaturedPosts(): Observable<Post[]> {
    const postsFeaturedCollection = query(
      this.postsCollection,
      where('isFeatured', '==', true),
      limit(4)
    );

    return this.loadDataFromQuery(postsFeaturedCollection);
  }

  loadSimilarPosts(categoryId: string) {
    const postsSimilarCollection = query(
      this.postsCollection,
      where('category.categoryId', '==', categoryId),
      limit(4)
    );

    return this.loadDataFromQuery(postsSimilarCollection);
  }

  loadLatestPosts(): Observable<Post[]> {
    const postsLimitCollection = query(
      this.postsCollection,
      orderBy('createdAt')
    );

    return this.loadDataFromQuery(postsLimitCollection);
  }

  loadCategoryPosts(categoryId: string) {
    const postsCategoryCollection = query(
      this.postsCollection,
      where('category.categoryId', '==', categoryId)
    );

    return this.loadDataFromQuery(postsCategoryCollection);
  }

  private loadDataFromQuery(query: Query): Observable<Post[]> {
    // метод загружает посты по фильтру из коллекции Firestore
    let unsubscribe: () => void;

    return new Observable((observer: Subscriber<Post[]>) => {
      unsubscribe = onSnapshot(
        query,
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

  countViews(postId: string) {
    const viewCount = {
      views: increment(1),
    };

    return from(updateDoc(doc(this.postsCollection, postId), viewCount)).pipe(
      catchError((err) => {
        console.error(`Error: ${err}`);
        return throwError(() => `Data update error. Please try again`);
      })
    );
  }
}
