import { Component, Input } from '@angular/core';
import { MediaService } from '../../services/media/media.service';
import { media } from '../../models/media';
import { tag } from 'src/app/models/tag';
import { reaction_short } from 'src/app/models/reaction';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  @Input() data: media;
  @Input() public ID: number = -1;
  @Input() public imageData: string;
  @Input() public created: Date;
  @Input() public last_edit: Date;
  @Input() public visibility: number;
  @Input() public description: string;
  @Input() public tags?: tag[];
  @Input() public reactions?: reaction_short[];
  @Input() public placeholder: string;

  constructor(private MediaService: MediaService) {
    if (this.ID) {
      this.MediaService.getOneFromUserID(this.ID).subscribe({
        next: (value) => {
          this.data = value;

          this.ID = this.ID ?? this.data.ID;
          this.imageData = this.imageData ?? this.data.data;
          this.created = this.created ?? this.data.created;
          this.last_edit = this.last_edit ?? this.data.last_edit;
          this.visibility = this.visibility ?? this.data.visibility;
          this.description = this.description ?? this.data.description;
          this.tags = this.tags ?? this.data.tags;
          this.reactions = this.reactions ?? this.data.reactions;
          this.placeholder = this.placeholder ?? this.data.placeholder;
        },
        error: (err) => {
          console.error(err);
        },
      });
    };

  };



};
