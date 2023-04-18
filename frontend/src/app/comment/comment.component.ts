import { Component, Input } from '@angular/core';
import { CommentService } from '../services/comment/comment.service';
import { ReactionService } from '../services/reaction/reaction.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input() public content:string;
  @Input() public created:Date;
  @Input() public last_edit:Date;
  @Input() public user_alias:string;
  @Input() public ID:number;  

  constructor(private CommentService: CommentService, private ReactionService:ReactionService) {
    console.log(this.content)
  };

  react():void {
    console.log("reaction")
  };
};
