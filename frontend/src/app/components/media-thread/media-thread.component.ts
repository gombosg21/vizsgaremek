import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { media } from 'src/app/models/media';
import { thread } from 'src/app/models/thread';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaService } from 'src/app/services/media/media.service';
import { ThreadService } from 'src/app/services/thread/thread.service';

@Component({
  selector: 'app-media-thread',
  templateUrl: './media-thread.component.html',
  styleUrls: ['./media-thread.component.css']
})
export class MediaThreadComponent implements OnInit, OnDestroy {
  public mediaID?: number;
  public threadID?: number;

  constructor(private router: ActivatedRoute, private Auth: AuthService, private ThreadService: ThreadService, private MediaService: MediaService) {
  };

  ngOnInit(): void {
    this.mediaID = this.router.snapshot.params['mediaid'];
    this.threadID = this.router.snapshot.params['threadid'];
  };

  ngOnDestroy(): void {};

};
