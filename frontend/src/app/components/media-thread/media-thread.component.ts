import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-thread',
  templateUrl: './media-thread.component.html',
  styleUrls: ['./media-thread.component.css']
})
export class MediaThreadComponent implements OnInit, OnDestroy {
  public mediaID?: number;
  public threadID?: number;

  constructor(private router: ActivatedRoute) {
  };

  ngOnInit(): void {
    this.mediaID = this.router.snapshot.params['mediaid'];
    this.threadID = this.router.snapshot.params['threadid'];
  };

  ngOnDestroy(): void {};

};
