import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from '../services/thread/thread.service';
import { comment } from '../models/comment';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
})
export class ThreadComponent implements OnInit {

  @Input() public name: string;
  @Input() public created: Date;
  @Input() public last_activity: Date;
  @Input() public status: number;
  @Input() public comments: comment[];

  public threadStatus: string;



  constructor(private ThreadService: ThreadService) {

  };

  ngOnInit():void {
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

  editComment():void {

  };

  deleteComment():void {

  };

  react(): void {

  };

};
