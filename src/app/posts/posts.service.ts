import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  getPosts() {
    //return [...this.posts]; //new array from old object //staring empty not getting update //will have to do it by event driven //rxjs//observable
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  // addPost(post: Post){}

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
