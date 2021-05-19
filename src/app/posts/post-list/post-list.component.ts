import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
// export class PostListComponent {
//   // posts = [
//   //   { title: 'First Post', content: `this is first post` },
//   //   { title: 'Second Post', content: `this is Second post` },
//   //   { title: 'Third Post', content: `this is Third post` },
//   // ];
//   @Input() posts: Post[] = []; //need to bind it from outside(only from parent) via eventBinding, by default not bind
//   postsService: PostsService;

//   constructor(postsService: PostsService) {
//     this.postsService = postsService
//   }
// }
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: `this is first post` },
  //   { title: 'Second Post', content: `this is Second post` },
  //   { title: 'Third Post', content: `this is Third post` },
  // ];
  // @Input()
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;//page size how many items we want on give page
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  userIsAuthenticated = false;
  userId: string;
  posts: Post[] = []; //need to bind it from outside(only from parent) via eventBinding, by default not bind
  //postsService: PostsService;
  private postSub: Subscription; //we use to when the component is destroyed by using lifecycle hook
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {
    //we can do this or use angular lifecylce of hook OnInit
    //this.postsService = postsService
  }
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //empty always
    this.userId = this.authService.getUserId();
    console.log(`userID ${this.userId}`);
    //console.log(`getPost result ${this.posts}`);
    //this subscription is ever lasting if component is not in use, it will create memory leak to overcome we use Subscription from rxjs
    //this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
    this.postSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      }); //subsribe 3 arguments (function execuated when data is emitted, called when error, called when observable is completed)
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAutheticated => {
      console.log(`userID1 ${this.userId}`);
      this.userId = this.authService.getUserId();
      this.userIsAuthenticated = isAutheticated;
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(`Page data ${JSON.stringify(pageData)}`);
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe(); //prevent memory leaks
    this.authStatusSub.unsubscribe();
  }
}
