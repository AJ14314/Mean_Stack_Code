import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './posts.model';

//angular create 1 intance of the service
//{1.angular is unaware of the service yet, we have to include service in the app module in providers
//2. or make service injectable by @Injectable() }
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  //to use token we need to inject auth srvice into this service or we can create intercepter for our httpclient 
  //angular feature
  //thay are funtions that are run on any outgoing http request
  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    //return [...this.posts]; //new array from old object //staring empty not getting update //will have to do it by event driven //rxjs//observable

    /* renaming _id to id, while receving data from the server before subscribing. hhtp client of angular uses observables we have access to operators of observables,
      + operators are functions/actions we can apply to streams/data before the data is ultimately handled in subscription*/
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; posts: any; maxPosts: number }>('http://localhost:3000/api/posts' + queryParams).pipe(map((postData) => {
      return {
        posts: postData.posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        }), maxPosts: postData.maxPosts
      }
    })
    )
      .subscribe((transformedPostData) => {
        // console.log(`transformedPosts ${JSON.stringify(transformedPostData)}`);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // addPost(post: Post){}
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      `http://localhost:3000/api/posts/${id}`
    );
  }

  addPost(title: string, content: string, image: File) {
    //now we have to include form data because image is added instead of post object
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData(); //allows us to combine text value and blob
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // third argument is name of the image used by backend to save the file as of now post title
    //the name which we access in the backend
    this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        console.log(responseData.message);
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath
        // };
        // // const createdId = responseData.postId;
        // // post.id = createdId;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    //const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

    } else {
      postData = {
        id: id, title: title, content: content, imagePath: image
      }
    }
    console.log(`Updated post here ${postData}`);
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        console.log(`response updated ${JSON.stringify(response)}`);
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        // const post: Post = {
        //   id: id, title: title, content: content, imagePath: ""
        // }
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
