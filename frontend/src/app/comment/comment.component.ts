import { Component } from '@angular/core';
import { CommentService } from '../services/comment/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  constructor(private CommentService: CommentService) {

  };

  content:string = "";
  created:Date = new Date();
  last_edit:Date = new Date();
  user_alias:String = "";

  react():void {
    console.log("reaction")
  };
};
