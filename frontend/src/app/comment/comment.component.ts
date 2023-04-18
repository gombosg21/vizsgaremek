import { Component, Input } from '@angular/core';
import { CommentService } from '../services/comment/comment.service';
import { ReactionService } from '../services/reaction/reaction.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input() public content:string | undefined = "";
  @Input() public created:Date | undefined = new Date();
  @Input() public last_edit:Date | undefined = new Date();
  @Input() public user_alias:String | undefined = "";
  @Input() public ID:number | undefined = -1;  

  constructor(private CommentService: CommentService, private ReactionService:ReactionService) {

  };

  react():void {
    console.log("reaction")
  };
};
