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
  private mediaID?: number = this.router.snapshot.params['mediaid'];
  private threadID?: number = this.router.snapshot.params['threadid'];
  public media: media;
  public thread: thread;

  constructor(private router: ActivatedRoute, private Auth: AuthService, private ThreadService: ThreadService, private MediaService: MediaService) {
  };

  ngOnInit(): void {
    if (this.mediaID && this.threadID) {
      this.ThreadService.getThreadByID(this.threadID).subscribe({
        next: (val) => {
          this.thread = val;
          this.ThreadService.setLocalData(this.thread);
        },
        error: (err) => { console.error(err) },
        complete: () => { }
      });
      this.MediaService.getOneByID(this.mediaID).subscribe({
        next: (val) => {
          if (Object.hasOwn(val, 'file_data')) {
            this.media = val as media;
            this.MediaService.setLocalMediaInstance(this.media);
          };
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => { }
      })
    };
  };

  ngOnDestroy(): void {

  };

};
