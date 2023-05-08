import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { thread_short, thread } from 'src/app/models/thread';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thread-short',
  templateUrl: './thread-short.component.html',
  styleUrls: ['./thread-short.component.css']
})
export class ThreadShortComponent {

  @Input() public threads: thread_short[];
  @Input() public mediaID: number;
  @Output() threadGet = new EventEmitter<thread>();


  constructor(private router: Router) { }

  open(ID:number): void {
    console.log(['open',this.mediaID,ID])

    this.router.navigate(['media/' + this.mediaID + '/thread/' + ID]);
  };
};
