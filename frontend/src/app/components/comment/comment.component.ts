import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommentService } from '../../services/comment/comment.service';
import { ReactionService } from '../../services/reaction/reaction.service';
import { comment } from '../../models/comment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  public data: comment;

  public showAddReactions: boolean = false;

  @Input() public iterator: number;

  @Output() isDeleted: EventEmitter<comment> = new EventEmitter<comment>();

  public sessionID: number = -1;
  public showEdit: boolean = false;
  public newReactionID: number;


  private userSub: Subscription;
  private commentSub: Subscription;

  constructor(private CommentService: CommentService, private ReactionService: ReactionService, private Auth: AuthService) {
    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => {
        this.sessionID = value ?? -1;
      },
      error: (err) => { console.error(err); },
      complete: () => {
      },
    });
  };

  ngOnInit(): void {
    this.CommentService.getLocalCommentList().subscribe({
      next: (value) => {
        this.data = value[this.iterator];
        if (this.data.reactions) {
          this.ReactionService.setStoredInstanceList(this.data.reactions);
        };
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => { }
    });
  };

  ngOnDestroy(): void {
    if (this.commentSub) {
      this.commentSub.unsubscribe();
    };
    this.userSub.unsubscribe();
  };

  react(): void {
    this.showAddReactions = true;
  };

  edit(): void {
    this.showEdit = true;
  };

  cancelEdit(): void {
    this.showEdit = false;
  };

  addReaction(reactionID: number) {
    if (this.data.reactions) {
      for (let i = 0; i < this.data.reactions.length; i++) {
        if (this.data.reactions[i].ID == reactionID) {
          this.data.reactions[i].count++;
        };
      };
    };
    this.data.reactions = [{ ID: reactionID, count: 1 }];
    this.ReactionService.setStoredInstanceList(this.data.reactions);
    this.newReactionID = reactionID;
  };

  sendEdit(): void {
    this.showEdit = false;
    this.CommentService.editComment(this.data.content, this.data.ID).subscribe({
      next: (value) => {
        this.data = value;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => { }
    });
  }

  delete() {
    //TODO: ask user if they REALLY want to delete

    this.CommentService.deleteComment(this.data.ID).subscribe({
      next: (value) => {
        this.isDeleted.emit(this.data);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {

      }
    });
  };
};
