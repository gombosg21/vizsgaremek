import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ThreadService } from '../../services/thread/thread.service';
import { comment } from '../../models/comment';
import { thread } from '../../models/thread';
import { CommentService } from '../../services/comment/comment.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {

  pageSize = 5;
  pageIndex = 0;

  @Input() threadID: number;
  @Input() public iterator: number = 0;
  @Input() public data: thread;

  public newReactionID: number;

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
  };

  ngOnInit(): void {
    this.userSub = this.Auth.getUserID().subscribe({
      error: (err) => {
        console.error(err);
      },
      next: (value) => {
        this.sessionId = value ?? -1;
        if (this.sessionId != -1) {
          this.showNewComment = true;
        }
      }, complete: () => { },
    });

    if (this.threadID) {
      this.threadSub = this.ThreadService.getThreadByID(this.threadID).subscribe({
        next: (val) => {
          console.log('ID', val)
          this.data = val ?? this.data;
          this.CommenctService.setLocalCommentList = this.data.comments;
        },
        error: (err) => {
          console.error(err)
        },
        complete: () => { }
      });
    } else {
      this.threadSub = this.ThreadService.getLocalData.subscribe({
        next: (val) => {
          console.log('local', val)
          this.data = val ?? this.data;
          this.CommenctService.setLocalCommentList = this.data.comments;
        },
        error: (err) => {
          console.error(err)
        },
        complete: () => { }
      });
      if (this.data.reactions) {
        this.ReactionService.setStoredInstanceList(this.data.reactions);
      };
    };

    switch (this.data.status) {
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
    };
  };

  comment(): void {
    this.CommenctService.postComment(this.newCommentContent, this.data.ID).subscribe({
      next: (value) => {
        this.data.comments.push(value);
      }, error: (err) => {
        console.error(err);
      }, complete: () => {
      },
    })
  };

  removeComment(comment: comment): void {
    this.data.comments.splice(this.data.comments.indexOf(comment), 1);
    this.CommenctService.setLocalCommentList = this.data.comments;
  };

  addReaction(reactionID: number): void {
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

  react() {
    this.showAddReactions = true;
  };

  edit(): void {
    this.showEdit = true;
    this.newName = this.data.name;
  };

  cancelEdit(): void {
    this.showEdit = false;
  };

  sendEdit(): void {
    this.showEdit = false;
    this.ThreadService.patchThreadName(this.newName, this.data.ID).subscribe({
      next: (value) => {
        this.data.name = this.newName;
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
      }
    });
  };

  ngOnDestroy(): void {
    if (this.threadSub) {
      this.threadSub.unsubscribe();
    };
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
  };
};