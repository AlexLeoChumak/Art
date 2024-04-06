import { Injectable } from '@angular/core';
import {
  DocumentData,
  Firestore,
  Query,
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, Subscriber, catchError, from, throwError } from 'rxjs';

import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsCollection = collection(this.fs, 'posts');

  constructor(private fs: Firestore, private router: Router) {}

  loadAllPosts(): Observable<Post[]> {
    return this.loadDataFromQuery(this.postsCollection);
  }

  loadPostById(id: string): Observable<DocumentData> {
    // Получаем документ из Firestore и отслеживаем его изменения
    return new Observable<DocumentData>(
      (observer: Subscriber<DocumentData>) => {
        const unsubscribe = onSnapshot(
          doc(this.postsCollection, id),
          (docSnapshot) => {
            const data = docSnapshot.data();

            if (!data) {
              observer.error(new Error('Data getting error. Please try again'));
              this.router.navigate(['/']);
            } else {
              observer.next(data);
            }
          },
          (error) => {
            console.error(`Error: ${error}`);
          }
        );

        return () => {
          unsubscribe();
        };
      }
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
    return new Observable<Post[]>((observer) => {
      const unsubscribe = onSnapshot(
        query,
        (snapshot) => {
          const posts: any[] = snapshot.docs.map((doc) => {
            const docData = doc.data();
            const id = doc.id;
            return docData ? { id, ...docData } : null;
          });

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

  countViews(postId: string) {
    const viewCount = {
      views: increment(1),
    };

    return from(updateDoc(doc(this.postsCollection, postId), viewCount)).pipe(
      catchError((err) => {
        console.error(`Error: ${err}`);
        this.router.navigate(['**']);
        return throwError(() => err);
      })
    );
  }
}
