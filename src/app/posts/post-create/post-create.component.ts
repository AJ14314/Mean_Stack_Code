import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../posts.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  //not using because using form element start
  enteredTitle = '';
  enteredContent = '';
  //not using because using form element end
  @Output() postCreated = new EventEmitter<Post>(); //can control what type of event we emit

  //newPost='NO CONTENT';
  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    //this needs to be model/blueprints as we are using same thing for multiple components
    const post: Post = {
      title: form.value.title,
      content: form.value.content,
    };
    this.postCreated.emit(post);
  }
}
