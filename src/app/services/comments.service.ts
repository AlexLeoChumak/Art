import { Injectable } from '@angular/core';
import {
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  Query,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
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
  switchMap,
  throwError,
} from 'rxjs';
import { Comment } from '../models/comment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  commentsCollection = collection(this.fs, 'comments');

  constructor(private fs: Firestore) {}

  saveCommentToCollection(comment: Comment): Observable<Comment> {
    // Создаем новый документ в коллекции и получаем его id
    const docRef = doc(this.commentsCollection);

    // Добавляем id в объект comment
    comment.id = docRef.id;

    // Сохраняем объект comment в документ
    return from(setDoc(docRef, comment)).pipe(
      map(() => comment),
      catchError((err) => {
        console.error(`Error: ${err}`);
        return throwError(() => `Data insert error. Please try again`);
      })
    );
  }

  updateCommentToCollection(id: string, editedComment: any) {
    // метод обновляет документ в Firestore
    return from(
      updateDoc(doc(this.commentsCollection, id), editedComment)
    ).pipe(
      catchError((err: FirestoreError) => {
        console.error(`Error: ${err}`);
        return throwError(() => `Data update error. Please try again`);
      })
    );
  }

  loadCommentById(valueName: string, id: string): Observable<any[]> {
    const comment = query(this.commentsCollection, where(valueName, '==', id));

    return this.loadDataFromQuery(comment);
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
}
