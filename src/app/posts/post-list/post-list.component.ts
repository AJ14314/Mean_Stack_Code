import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  posts = [
    { title: 'First Post', conntent: `this is first post` },
    { title: 'Second Post', conntent: `this is Second post` },
    { title: 'Third Post', conntent: `this is Third post` },
  ];
}
