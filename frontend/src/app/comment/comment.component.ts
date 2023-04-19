import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../services/comment/comment.service';
import { ReactionService } from '../services/reaction/reaction.service';
import { comment } from '../models/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  private data:comment;

  @Input() public content:string;
  @Input() public created:Date;
  @Input() public last_edit:Date;
  @Input() public user_alias:string;
  @Input() public ID:number;  
  @Input() public iterator:number = 0;

  constructor(private CommentService: CommentService, private ReactionService:ReactionService) {
    this.data = this.CommentService.getLocalData()[this.iterator];
  };

  ngOnInit(): void {
    this.data = this.CommentService.getLocalData()[this.iterator];

    this.content = this.data.content ?? this.content;
    this.ID = this.data.ID ?? this.ID;
    this.last_edit = this.data.last_edit ?? this.last_edit;
    this.created = this.data.created ?? this.created;
  }

  react():void {
    console.log("reaction")
  };
};
