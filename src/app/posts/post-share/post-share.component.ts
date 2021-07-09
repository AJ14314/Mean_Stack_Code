import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-share',
  templateUrl: './post-share.component.html',
  styleUrls: ['./post-share.component.css']
})
export class PostShareComponent implements OnInit {

  public postId: string;
  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        alert('id ' + paramMap.get('postId'));
        this.postId = paramMap.get('postId');
      }
    })
  }

}
