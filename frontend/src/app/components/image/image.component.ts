import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MediaService } from '../../services/media/media.service';
import { media } from '../../models/media';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { ErrorModel } from 'src/app/models/error';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { tag } from 'src/app/models/tag';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnDestroy {

  public showImageModal: boolean = false;

  @Input() public data: media | ErrorModel;
  @Input() public mediaID: number;
  @Input() public media: media;
  @Input() public iterator: number = 0;
  @Input() public ErrorInstance: ErrorModel;
  public sessionId?: number;
  private userSub: Subscription;
  public showAddReactions: boolean = false;
  public showEditTags: boolean = false;
  private mediaSub: Subscription;

  constructor(private MediaService: MediaService, private ReactionService: ReactionService, private Auth: AuthService) {
    if (this.mediaID) {
      this.MediaService.getOneByID(this.mediaID).subscribe({
        next: (value) => {
          if (value.hasOwnProperty('file_data')) {
            this.media = value as media;
            console.log(this.media)
          };
          if (value.hasOwnProperty('error')) {
            this.ErrorInstance = value as ErrorModel;
          };
        },
        error: (err) => {
          console.error(err);
        },
      });
      this.userSub = this.Auth.getUserID().subscribe({
        next: (value) => { this.sessionId = value },
        error: (err) => { console.error(err) },
        complete: () => { }
      })
    };

    if (this.iterator) {

      this.mediaSub = this.MediaService.getLocalMediaList().subscribe({
        next: (value) => {
          const ListItem = value[this.iterator];
          if (ListItem.hasOwnProperty('file_data')) {
            this.media = ListItem as media;
            if (this.media.reactions) {
              this.ReactionService.setStoredInstanceList(this.media.reactions);
            };
          };
          if (ListItem.hasOwnProperty('error')) {
            this.ErrorInstance = ListItem as ErrorModel;
          };
        },
        error: (err) => { console.error(err) },
        complete: () => { }
      });
    };
  };

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    };
  };

  hideEditTags(): void {
    this.showEditTags = false;
  };

  addTags(tags: tag[]): void {
    if (this.media.tags) {
      this.media.tags = this.media.tags.concat(tags);
    };
  };

  removeTags(tags: tag[]): void {
    if (this.media.tags) {
      this.media.tags = this.media.tags.filter(tag => !(tags.includes(tag)));
    };
  };

  ngOnInit(): void {
    if (this.data) {
      if (this.data.hasOwnProperty('file_data')) {
        this.media = this.data as media;
        if (this.media.reactions) {
          this.ReactionService.setStoredInstanceList(this.media.reactions);
        };
      };
      if (this.data.hasOwnProperty('error')) {
        this.ErrorInstance = this.data as ErrorModel;
      };

    }
  };

  react(): void {
    this.showAddReactions = true;
  };

  addReaction(reactionID: number): void {
    if (this.media) {
      if (this.media.reactions) {
        for (let i = 0; i < this.media.reactions.length; i++) {
          if (this.media.reactions[i].ID == reactionID) {
            this.media.reactions[i].count++;
          };
        };
      };
      this.media.reactions = [{ ID: reactionID, count: 1 }];
      this.ReactionService.setStoredInstanceList(this.media.reactions);
    };
  };

  showModal(): void {
    this.showImageModal = true;
  };


  hideModal(): void {
    this.showImageModal = false;
  };

};
