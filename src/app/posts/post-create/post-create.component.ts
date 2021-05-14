import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  //not using because using form element start
  enteredTitle = '';
  enteredContent = '';
  //creating our form in ts of type FormGroup
  //sync html code with typescript code
  form: FormGroup;
  imagePreview: string;
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
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)],}),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: mimeType
      }), //won't sync with html, can control it's value manually from ts
    });

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
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
            });
          });
        }, 0);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    //convert that file into url for image tag
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  //newPost='NO CONTENT';

  onSavePost() {
    //form: NgForm
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.form.value);
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    //this needs to be model/blueprints as we are using same thing for multiple components
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content,
    // };
    this.form.reset();
  }
}
