import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from '../../services/thread/thread.service';
import { comment } from '../../models/comment';
import { thread } from '../../models/thread';
import { CommentService } from '../../services/comment/comment.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
})
export class ThreadComponent implements OnInit {

  private data: thread;

  @Input() public name: string;
  @Input() public created: Date;
  @Input() public last_activity: Date;
  @Input() public status: number;
  @Input() public comments: comment[];
  @Input() public iterator: number = 0;

  public threadStatus: string;

  constructor(private ThreadService: ThreadService, private CommenctService:CommentService ) {
    this.data = this.ThreadService.getLocalData()[this.iterator];
    
    this.name = this.data.name ?? this.name;
    this.created = this.data.created ?? this.created;
    this.last_activity = this.data.last_activity ?? this.last_activity;
    this.status = this.data.status ?? this.status;
    this.comments = this.data.comments ?? this.comments;

    this.CommenctService.setLocalData(this.comments);
  };

  ngOnInit(): void {
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

};
