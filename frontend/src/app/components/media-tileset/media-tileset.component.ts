import { Component, Input, OnInit } from '@angular/core';
import { media } from 'src/app/models/media';
import { MediaService } from 'src/app/services/media/media.service';
import { getTokenUserID } from '../../helpers/extractors/token';

@Component({
  selector: 'app-media-tileset',
  templateUrl: './media-tileset.component.html',
  styleUrls: ['./media-tileset.component.css']
})
export class MediaTilesetComponent implements OnInit {

  @Input() userID: number;
  @Input() medias: media[];

  private windowWidth: number = window.innerWidth;

  public cols: number;

  constructor(private MediaService: MediaService) {
    if (this.userID == undefined) {
      this.userID = getTokenUserID()
    };
    switch (true) {
      case (this.windowWidth > 2000): {
        this.cols = 6;
        break;
      }
      case (this.windowWidth > 1600): {
        this.cols = 5;
        break;
      }
      case (this.windowWidth > 1200): {
        this.cols = 4;
        break;
      }
      case (this.windowWidth > 800): {
        this.cols = 3;
        break;
      }
      case (this.windowWidth > 800): {
        this.cols = 2;
        break;
      }
      case (this.windowWidth < 801): {
        this.cols = 1;
        break;
      }
      default: {
        this.cols = 1;
        console.error({ error: "cannot acces display size, using default column counts" })
      }
    };
  };



  ngOnInit(): void {
    if (this.userID) {
      this.MediaService.getAllMediaFromUserID(this.userID).subscribe({
        next: (value) => {
          if (value[0] != undefined) {
            this.medias = value ?? this.medias;
            this.MediaService.setLocalMediaList(this.medias);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    };
    console.log("a", this.cols)
    console.log(this.windowWidth);
  };

};
