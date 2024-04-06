import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  catchError,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';

import { Post } from 'src/app/models/post';
import { MocDataService } from 'src/app/services/moc-data.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  post!: DocumentData | Post;
  similarPosts!: Post[];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private toastr: ToastrService,
    private router: Router,
    private mocDataService: MocDataService //moc
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap((params) =>
          this.postsService.countViews(params['id']).pipe(
            map(() => params['id']) // Возвращаю id для следующего шага в цепочке
          )
        ),
        switchMap((id) => this.postsService.loadPostById(id)),
        tap((post) => {
          post ? (this.post = post) : this.router.navigate(['/**']);
        }),
        switchMap((post) =>
          this.postsService.loadSimilarPosts(post['category'].categoryId)
        ),
        catchError((err) => throwError(() => err)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (data: Post[]) => {
          this.similarPosts = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.post = this.mocDataService.posts[0]; //moc
          this.similarPosts = this.mocDataService.posts; //moc
          this.toastr.error(err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
