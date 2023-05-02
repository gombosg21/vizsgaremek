import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommentService } from '../../services/comment/comment.service';
import { ReactionService } from '../../services/reaction/reaction.service';
import { comment } from '../../models/comment';
import { reaction_short } from 'src/app/models/reaction';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  private data: comment;

  public showAddReactions: boolean = false;

  @Input() public content: string;
  @Input() public created: Date;
  @Input() public last_edit: Date;
  @Input() public user: any;
  @Input() public ID: number;
  @Input() public iterator: number = 0;
  @Input() public reactions: reaction_short[];
  @Input() public commentUserID: number;
  public sessionID: number = -1;
  public showEdit: boolean = false;

  private userSub: Subscription;

  constructor(private CommentService: CommentService, private ReactionService: ReactionService, private Auth: AuthService) {
    this.data = this.CommentService.getLocalCommentList()[this.iterator];

    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => {
        this.sessionID = value ?? -1;
      },
      error: (err) => { console.error(err); },
      complete: () => {

      },
    })
  };

  ngOnInit(): void {
    this.data = this.CommentService.getLocalCommentList()[this.iterator];

    this.content = this.data.content ?? this.content;
    this.ID = this.data.ID ?? this.ID;
    this.last_edit = this.data.last_edit ?? this.last_edit;
    this.created = this.data.created ?? this.created;
    this.commentUserID = this.data.user.ID ?? this.commentUserID;
    if (this.data.reactions) {
      this.reactions = this.data.reactions;
      this.ReactionService.setStoredInstanceList(this.reactions);
    };
  };

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  };

  react() {
    this.showAddReactions = true;
  };

  edit(): void {
    this.showEdit = true;

  };

  sendEdit(): void {
    const data = { content: this.content };
    this.showEdit = false;
    this.CommentService.editComment(data, this.ID).subscribe({
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

    this.CommentService.deleteComment(this.ID).subscribe({
      next: (value) => {

      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {

      }
    });
  };
};
