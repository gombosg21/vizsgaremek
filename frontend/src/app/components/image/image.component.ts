import { Component, Input } from '@angular/core';
import { MediaService } from '../../services/media/media.service';
import { media } from '../../models/media';
import { ReactionService } from 'src/app/services/reaction/reaction.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  @Input() public mediaID: number;
  @Input() public media: media;
  @Input() public iterator: number = 0;

  constructor(private MediaService: MediaService, private ReactionService: ReactionService) {
    if (this.mediaID) {
      this.MediaService.getOneFromUserID(this.mediaID).subscribe({
        next: (value) => {
          this.media = value;
          if (this.media.reactions) {
            this.ReactionService.setStoredInstanceList(this.media.reactions);
            console.log(this.media.reactions)
          };
        },
        error: (err) => {
          console.error(err);
        },
      });
    };
    if (this.media) {
      if (this.media.reactions) {
        this.ReactionService.setStoredInstanceList(this.media.reactions);
        console.log(this.media.reactions)
      };
    };
  };
};
