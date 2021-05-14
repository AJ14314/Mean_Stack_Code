import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  //not using because using form element start
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  //not using because using form element end
  // @Output()
  // postCreated = new EventEmitter<Post>(); //can control what type of event we emit

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //spinner start
        this.isLoading = true;
        setTimeout(() => {
          this.postsService.getPost(this.postId).subscribe((postData) => {
            //spinner end
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
            };
          });
        }, 0);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  //newPost='NO CONTENT';
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(form.value);
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    //this needs to be model/blueprints as we are using same thing for multiple components
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content,
    // };
    form.resetForm();
  }
}
