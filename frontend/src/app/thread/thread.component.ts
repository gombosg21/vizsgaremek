import { Component, Input } from '@angular/core';
import { ThreadService } from '../services/thread/thread.service';
import { comment } from '../models/comment';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css'],
})
export class ThreadComponent {

  @Input() public name:string = "";
  @Input() public created:Date = new Date();
  @Input() public last_activity:Date = new Date();
  @Input() public status:number = 0;
  @Input() public comments:comment[];

  constructor(private ThreadService: ThreadService) { 

  };

  comment():void {

  };

  react():void {

  };

};
