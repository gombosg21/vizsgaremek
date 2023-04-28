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


  constructor(private MediaService: MediaService) {
    if (this.mediaID) {
      this.MediaService.getOneFromUserID(this.mediaID).subscribe({
        next: (value) => {
          this.media = value;
        },
        error: (err) => {
          console.error(err);
        },
      });

    };
  };
};
