import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './posts.model';

//angular create 1 intance of the service
//{1.angular is unaware of the service yet, we have to include service in the app module in providers
//2. or make service injectable by @Injectable() }
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts]; //new array from old object //staring empty not getting update //will have to do it by event driven //rxjs//observable
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  // addPost(post: Post){}

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
