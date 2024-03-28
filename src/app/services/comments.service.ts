import { Injectable } from '@angular/core';
import {
  Firestore,
  FirestoreError,
  collection,
  collectionData,
  doc,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { Comment } from '../models/comment';

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
    return collectionData(comment);
  }
}
