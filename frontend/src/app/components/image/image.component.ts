import { Component, Input } from '@angular/core';
import { MediaService } from '../../services/media/media.service';
import { media } from '../../models/media';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  @Input() mediaID: number;
  @Input() media: media;
  public reactionIDs: number[];

  constructor(private MediaService: MediaService) {
    if (this.media) {
      if (this.media.reactions) {
        this.reactionIDs = this.media.reactions!.map(reaction => reaction.ID);
      };
    };

    if (this.mediaID) {
      this.MediaService.getOneFromUserID(this.mediaID).subscribe({
        next: (value) => {
          this.media = value;
          if (this.media.reactions) {
            this.reactionIDs = this.media.reactions!.map(reaction => reaction.ID);
          };
        },
        error: (err) => {
          console.error(err);
        },
      });

    };
  };
};
