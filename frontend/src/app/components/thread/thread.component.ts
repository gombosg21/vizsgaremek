import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from '../../services/thread/thread.service';
import { comment } from '../../models/comment';
import { thread } from '../../models/thread';
import { CommentService } from '../../services/comment/comment.service';
import { PageEvent } from '@angular/material/paginator';
import { reaction } from 'src/app/models/reaction';
import { DbService } from 'src/app/services/db/db.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
})
export class ThreadComponent implements OnInit {

  private data: thread;
  pageSize = 5;
  pageIndex = 0;
  paginatedComments: comment[] = [];

  @Input() public name: string;
  @Input() public created: Date;
  @Input() public last_activity: Date;
  @Input() public status: number;
  @Input() public comments: comment[];
  @Input() public iterator: number = 0;
  @Input() public reactions: reaction[];

  public threadStatus: string;

  constructor(private ThreadService: ThreadService, private CommenctService: CommentService, private DBService: DbService) {
    this.data = this.ThreadService.getLocalData()[this.iterator];

    this.name = this.data.name ?? this.name;
    this.created = this.data.created ?? this.created;
    this.last_activity = this.data.last_activity ?? this.last_activity;
    this.status = this.data.status ?? this.status;
    this.comments = this.data.comments ?? this.comments;

    if (this.data.thread_reactionlist.length != 0) {
      this.DBService.getCacheReactions(this.data.thread_reactionlist!.map(reaction => (reaction.ID))).subscribe({
        next: (value) => { this.reactions = this.reactions ?? value },
        error: (error) => {
          console.error(error);
        }
      });
    };

    this.CommenctService.setLocalData(this.comments);
  };

  ngOnInit(): void {

    this.paginateComments();
    switch (this.status) {
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

  };

  editComment(): void {

  };

  deleteComment(): void {

  };

  react(): void {

  };

  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateComments();
  }

  paginateComments(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedComments = this.comments.slice(startIndex, endIndex);
  }

};