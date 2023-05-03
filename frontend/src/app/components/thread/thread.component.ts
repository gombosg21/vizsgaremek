import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ThreadService } from '../../services/thread/thread.service';
import { comment } from '../../models/comment';
import { thread } from '../../models/thread';
import { CommentService } from '../../services/comment/comment.service';
import { PageEvent } from '@angular/material/paginator';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {

  pageSize = 5;
  pageIndex = 0;

  @Input() public iterator: number = 0;
  @Input() public thread: thread;

  public threadStatus: string;
  public showAddReactions: boolean = false;
  private userSub: Subscription;
  private threadSub: Subscription;
  public sessionId: number;
  public showNewComment: boolean = false;
  public showEdit: boolean;
  public newCommentContent: string;
  public newName: string;

  constructor(private ThreadService: ThreadService, private CommenctService: CommentService, private ReactionService: ReactionService, private Auth: AuthService) {
    this.threadSub = this.ThreadService.getLocalData().subscribe({
      next: (value) => {
        this.thread = value ?? this.thread
      },
      error: (err) => { console.error(err) },
      complete: () => { }
    });
    this.userSub = this.Auth.getUserID().subscribe({
      error: (err) => {
        console.error(err);
      },
      next: (value) => {
        this.sessionId = value ?? -1;
        if (this.sessionId != -1) {
          this.showNewComment = true;
        }
      }, complete: () => {

      },
    })
  };

  ngOnInit(): void {

    if (this.thread.reactions) {

      this.ReactionService.setStoredInstanceList(this.thread.reactions);
    };

    this.CommenctService.setLocalCommentList(this.thread.comments);

    switch (this.thread.status) {
      case 0:
        this.threadStatus = "open"
        break;

      case 1:
        this.threadStatus = "locked"
        break;

      case 2:
        this.threadStatus = "archived"
        break;

      default:
        this.threadStatus = "error"
        break;
    }
  }

  comment(): void {
    this.CommenctService.postComment(this.newCommentContent, this.thread.ID).subscribe({
      next: (value) => {
        this.thread.comments.push(value);
      }, error: (err) => {
        console.error(err);
      }, complete: () => {

      },
    })
  };

  removeComment(comment: comment): void {
    this.thread.comments.splice(this.thread.comments.indexOf(comment), 1);
    this.CommenctService.setLocalCommentList(this.thread.comments);
  };

  addReaction(reactionID: number): void {
    if (this.thread.reactions) {
      for (let i = 0; i < this.thread.reactions.length; i++) {
        if (this.thread.reactions[i].ID == reactionID) {
          this.thread.reactions[i].count++;
        };
      };
    };
    this.thread.reactions = [{ ID: reactionID, count: 1 }];
    this.ReactionService.setStoredInstanceList(this.thread.reactions);
  };

  react() {
    this.showAddReactions = true;
  };

  edit(): void {
    this.showEdit = true;
    this.newName = this.thread.name;
  };

  cancelEdit(): void {
    this.showEdit = false;
  };

  sendEdit(): void {
    this.showEdit = false;
    this.ThreadService.patchThreadName(this.newName, this.thread.ID).subscribe({
      next: (value) => {
        this.thread.name = this.newName;
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {

      }
    });
  };

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.threadSub.unsubscribe();
  };
};