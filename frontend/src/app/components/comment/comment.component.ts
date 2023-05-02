import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment/comment.service';
import { ReactionService } from '../../services/reaction/reaction.service';
import { comment } from '../../models/comment';
import { reaction_short } from 'src/app/models/reaction';
import { DbService } from 'src/app/services/db/db.service';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  private data: comment;

  public showAddReactions:boolean = false;

  @Input() public content: string;
  @Input() public created: Date;
  @Input() public last_edit: Date;
  @Input() public user: any;
  @Input() public ID: number;
  @Input() public iterator: number = 0;
  @Input() public reactions: reaction_short[];

  constructor(private CommentService: CommentService, private ReactionService: ReactionService, private DBService: DbService) {
    this.data = this.CommentService.getLocalCommentList()[this.iterator];
  };

  ngOnInit(): void {
    this.data = this.CommentService.getLocalCommentList()[this.iterator];

    this.content = this.data.content ?? this.content;
    this.ID = this.data.ID ?? this.ID;
    this.last_edit = this.data.last_edit ?? this.last_edit;
    this.created = this.data.created ?? this.created;
    if (this.data.reactions) {
      this.reactions = this.data.reactions;
      this.ReactionService.setStoredInstanceList(this.reactions);
    };
  };

  react() {
    this.showAddReactions = true;
  };

  edit() {

  };

  delete() {

  };
};
