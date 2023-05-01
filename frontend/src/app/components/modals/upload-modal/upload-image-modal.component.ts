import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { upload } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload-image-modal.component.html',
  styleUrls: ['./upload-image-modal.component.css'],
})

export class UploadImageModalComponent implements OnInit {

  public title: string = "Upload";

  constructor( private MediaService: MediaService, private DBService: DbService, @Inject(MAT_DIALOG_DATA) public data:any) {
  };

  async ngOnInit(): Promise<void> {
    this.DBService.getAllCacheTags().subscribe({
      error: (err) => {
        alert(err);
      },
      complete: () => {
      },
      next: (value) => {
        this.validTags = value;
      },
    });
  };

  public mediaInstance: upload = {};
  public validTags: tag[];
  public selectedIterator: number;

  public visibilityOptions: { name: string, value: number }[] = [
    { name: "Private", value: 0 },
    { name: "Friends Only", value: 1 },
    { name: "Registered Only", value: 2 },
    { name: "Public", value: 3 }
  ];

  //somehow it gets ID as an attr instead of id, likely due to IDB...
  public currentTags: any[] = [];


  @Output() upload = new EventEmitter<upload>();
  @Output() cancelUpload = new EventEmitter<void>();

  addTag(): void {
    // TODO: alert user that selected tag is a duplicate, or theres no selection
    if (this.selectedIterator) {
      const selectedTag: tag = this.validTags[this.selectedIterator];
      if (!(this.currentTags.includes(selectedTag))) {
        this.currentTags.push(selectedTag);
      };
    };
  };

  removeTag(tag: tag): void {
    if (this.currentTags.length != 0) {
      if (this.currentTags.includes(tag)) {
        this.currentTags.splice(this.currentTags.indexOf(tag), 1);
      };
    };
  };

  onImageSelected(event: any) {
    this.mediaInstance.image = event.target.files[0];
  };

  onSubmit(): void {
    if (this.mediaInstance) {

      var tagIDs: number[] = this.currentTags!.map(tag => tag.ID);
      this.mediaInstance.tag_id_array = tagIDs;

      // TODO: input validation

      this.upload.emit(this.mediaInstance);
      var uploadForm = new FormData();

      uploadForm.append("image", this.mediaInstance.image!);
      uploadForm.append("placeholder_text", this.mediaInstance.placeholder_text!);
      uploadForm.append("description", this.mediaInstance.description!);
      uploadForm.append("visibility", this.mediaInstance.visibility!);

      this.mediaInstance.tag_id_array.forEach(ID => {
        uploadForm.append("tag_id_array[]", String(ID));
      });

      this.MediaService.postMedia(uploadForm).subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err) => {
          alert(JSON.stringify(err.error));
        },
        complete: () => {
          console.log("done")
        }
      });

    };
  };

  cancel(): void {
    this.cancelUpload.emit();
  };
};
