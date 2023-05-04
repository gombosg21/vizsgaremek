import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { MediaService } from 'src/app/services/media/media.service';
import { media } from 'src/app/models/media';

@Component({
  selector: 'app-image-picker-modal',
  templateUrl: './image-picker-modal.component.html',
  styleUrls: ['./image-picker-modal.component.css']
})
export class ImagePickerModalComponent implements OnDestroy, OnInit {

  @Output() closed = new EventEmitter<void>();
  public medias: media[] = [];

  @Output() public mediaID = new EventEmitter<number>();
  @Output() public mediaData = new EventEmitter<string>();


  constructor(private MediaService: MediaService) {
  };

  ngOnDestroy(): void {
  };

  ngOnInit(): void {
    this.MediaService.getAllMediaFromUserID().subscribe({
      next: (val) => {
        val.forEach(value => {
          if (value.hasOwnProperty('file_data')) {
            this.medias.push(value as media);
          };
        })
      },
      error: (err) => {
        console.error(err);
      }
    });
  };

  close(): void {
    this.closed.emit();
  };

  picked(media: media): void {
    this.close();
    this.mediaID.emit(media.ID!);
    this.mediaData.emit(media.file_data);
  };
};
