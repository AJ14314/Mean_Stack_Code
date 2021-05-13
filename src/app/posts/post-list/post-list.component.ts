import { Component, Input } from '@angular/core';
import { Post } from '../posts.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  // posts = [
  //   { title: 'First Post', content: `this is first post` },
  //   { title: 'Second Post', content: `this is Second post` },
  //   { title: 'Third Post', content: `this is Third post` },
  // ];
  @Input() posts: Post[] = []; //need to bind it from outside(only from parent) via eventBinding, by default not bind
}
