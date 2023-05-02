import { Component, Input, OnInit } from '@angular/core';
import { MediaService } from '../../services/media/media.service';
import { media } from '../../models/media';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { ErrorModel } from 'src/app/models/error';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  public showImageModal: boolean = false;

  @Input() public data: media | ErrorModel;
  @Input() public mediaID: number;
  @Input() public media: media;
  @Input() public iterator: number = 0;
  @Input() public ErrorInstance: ErrorModel;

  constructor(private MediaService: MediaService, private ReactionService: ReactionService) {
    if (this.mediaID) {
      this.MediaService.getOneFromUserID(this.mediaID).subscribe({
        next: (value) => {
          if (value.hasOwnProperty('file_data')) {
            this.media = value as media;
          };
          if (value.hasOwnProperty('error')) {
            this.ErrorInstance = value as ErrorModel;
          };
        },
        error: (err) => {
          console.error(err);
        },
      });
    };

    if (this.iterator) {
      const ListItem = (this.MediaService.getLocalMediaList()[this.iterator]);

      if (ListItem as media) {
        this.media = ListItem as media;
      };

      if (ListItem as ErrorModel) {
        this.ErrorInstance = ListItem as ErrorModel;
      };
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

  showModal() {
    this.showImageModal = true;
  };


  hideModal() {
    this.showImageModal = false;
  };

};
