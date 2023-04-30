import { Component, EventEmitter, Output } from '@angular/core';
import { upload } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  constructor(private MediaService: MediaService, private DBService: DbService) {
    this.DBService.getAllCacheTags().subscribe({
      next: (value) => {
        this.validTags = value;
        console.log(this.validTags)
      },
      error: (err) => {
        console.error(err)
      }
    });
  }

  public mediaInstance: upload;
  public validTags: tag[];
  public selectedTag?: tag;

  public currentTags: tag[] = [];


  @Output() upload = new EventEmitter<upload>();
  @Output() cancelUpload = new EventEmitter<void>();

  addTag(): void {
    // TODO: alert user that selected tag is a duplicate, or theres no selection
    if (this.selectedTag) {
      if (!(this.validTags.includes(this.selectedTag))) {
        this.validTags.push(this.selectedTag);
      };
    };
  };

  removeTag(tag: tag): void {
    if (this.validTags.includes(tag)) {
      this.validTags.splice(this.validTags.indexOf(tag), 1);
    };
  };

  onSubmit(event: Event): void {
    if (this.mediaInstance) {
      var tagIDs: number[] = this.currentTags!.map(tag => tag.id);
      this.mediaInstance.tag_id_array = tagIDs;

      // TODO: input validation

      event.preventDefault();
      this.upload.emit(this.mediaInstance);
      var uploadForm = new FormData();


      uploadForm.append("image", this.mediaInstance.image);
      uploadForm.append("placeholder_text", this.mediaInstance.placeholder_text);
      uploadForm.append("description", this.mediaInstance.description);
      uploadForm.append("visibility", this.mediaInstance.visibility);
      uploadForm.append("tag_id_array", JSON.stringify(this.mediaInstance.tag_id_array));

      this.MediaService.postMedia(uploadForm);

    };
  };

  cancel(): void {
    this.cancelUpload.emit();
  };
};
