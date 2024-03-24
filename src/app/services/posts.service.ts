import { Injectable } from '@angular/core';
import {
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  Query,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, Subscriber, finalize } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsCollection = collection(this.fs, 'posts');

  constructor(private fs: Firestore) {}

  loadAllPosts(): Observable<Post[]> {
    return this.loadPostsFromQuery(this.postsCollection);
  }

  loadFeaturedPosts(): Observable<Post[]> {
    const postsFeaturedCollection = query(
      this.postsCollection,
      where('isFeatured', '==', true),
      limit(4)
    );

    return this.loadPostsFromQuery(postsFeaturedCollection);
  }

  loadLatestPosts(): Observable<Post[]> {
    const postsLimitCollection = query(
      this.postsCollection,
      orderBy('createdAt')
    );

    return this.loadPostsFromQuery(postsLimitCollection);
  }

  loadCategoryPosts(categoryId: string) {
    const postsCategoryCollection = query(
      this.postsCollection,
      where('category.categoryId', '==', categoryId)
    );

    return this.loadPostsFromQuery(postsCategoryCollection);
  }

  private loadPostsFromQuery(query: Query): Observable<Post[]> {
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
}
