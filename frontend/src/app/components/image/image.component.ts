import { Component, Input, OnInit } from '@angular/core';
import { MediaService } from '../../services/media/media.service';
import { media } from '../../models/media';
import { ReactionService } from 'src/app/services/reaction/reaction.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  public showImageModal:boolean = false;

  @Input() public mediaID: number;
  @Input() public media: media;
  @Input() public iterator: number = 0;
  public errorText:string;

  constructor(private MediaService: MediaService, private ReactionService: ReactionService) {
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

    if(this.iterator) {
      this.media = (this.MediaService.getLocalMediaList()[this.iterator]) ?? this.media;
    };
  };

  ngOnInit(): void {
    if (this.media.reactions) {
      this.ReactionService.setStoredInstanceList(this.media.reactions);
    };
  };

  showModal() {
    this.showImageModal = true;
  };


  hideModal() {
    this.showImageModal = false;
  };

};
