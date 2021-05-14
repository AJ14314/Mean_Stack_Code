import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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
  posts: Post[] = []; //need to bind it from outside(only from parent) via eventBinding, by default not bind
  //postsService: PostsService;
  private postSub: Subscription; //we use to when the component is destroyed by using lifecycle hook

  constructor(public postsService: PostsService) {
    //we can do this or use angular lifecylce of hook OnInit
    //this.postsService = postsService
  }
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(); //empty always
    //console.log(`getPost result ${this.posts}`);
    //this subscription is ever lasting if component is not in use, it will create memory leak to overcome we use Subscription from rxjs
    //this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
    this.postSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      }); //subsribe 3 arguments (function execuated when data is emitted, called when error, called when observable is completed)
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe(); //prevent memory leaks
  }
}
