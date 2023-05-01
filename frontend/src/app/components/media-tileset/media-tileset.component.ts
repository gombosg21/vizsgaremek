import { Component, Input, OnInit } from '@angular/core';
import { media } from 'src/app/models/media';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaService } from 'src/app/services/media/media.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadImageModalComponent } from '../modals/upload-image-modal/upload-image-modal.component';

@Component({
  selector: 'app-media-tileset',
  templateUrl: './media-tileset.component.html',
  styleUrls: ['./media-tileset.component.css']
})
export class MediaTilesetComponent implements OnInit {

  @Input() userID?: number;
  @Input() medias: media[];

  public showUploadModal:boolean = false;

  private windowWidth: number = window.innerWidth;

  public cols: number;

  constructor(private DialogRef: MatDialog, private MediaService: MediaService, private AuthService: AuthService) {

    if (this.userID == undefined) {
      this.AuthService.getUserID().subscribe({
        next: (value) => {
          this.userID = value;
        },
        error: (err) => {
          console.error(err)
        },
      });
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

  showModal(): void {
    const dialogRef = this.DialogRef.open(UploadImageModalComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
};

  hideModal() {
    this.showUploadModal = false;
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
