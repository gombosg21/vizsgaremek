import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { ThreadService } from '../../services/thread/thread.service'
import { thread_short, thread } from 'src/app/models/thread';

@Component({
  selector: 'app-thread-short',
  templateUrl: './thread-short.component.html',
  styleUrls: ['./thread-short.component.css']
})
export class ThreadShortComponent {

  @Input() public thread: thread_short;
  @Output() threadGet = new EventEmitter<thread>();


  constructor(private ThreadService: ThreadService) { }

  open(): void {
    this.ThreadService.getThreadByID(this.thread.ID).subscribe({
      error: (err) => { console.error(err); },
      next: (value) => {
        console.log(value);
        this.threadGet.emit(value);
      },
      complete: () => {

      },
    });
  };

};
