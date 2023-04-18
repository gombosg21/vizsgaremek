import { Component, Input } from '@angular/core';
import { ThreadService } from '../services/thread/thread.service';

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

  constructor(private ThreadService: ThreadService) { 

  };

  comment():void {

  };

  react():void {

  };

};
