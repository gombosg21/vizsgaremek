import { Component, Input } from '@angular/core';
import { MediaService } from '../services/media/media.service';
import { media } from '../models/media';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  private data: media;

  @Input() public ID: number = -1;
  @Input() public imageData: string;
  @Input() public created:Date;
  @Input() public last_edit:Date;
  @Input() public visibility:number;
  @Input() public description:string;
  @Input() public tags?:any[];
  @Input() public reactions?: any[];
  @Input() public placeholder:string;

  constructor(private MediaService: MediaService) {
    MediaService.getOneFromUserID(this.ID).subscribe(
      {
        next: (value) => {
          this.data = value;
        },
        error(err) {
          console.log(err);
        },
      }
    );
  };



};
