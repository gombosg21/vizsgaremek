import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { upload } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})

export class UploadComponent implements OnInit {

  constructor(private MediaService: MediaService, private DBService: DbService, private FormBuilder: FormBuilder) {
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

  public mediaUploadForm: FormGroup = this.FormBuilder.group({

  });

  public mediaInstance:upload = {};
  public validTags:tag[];
  public selectedIterator:number;

  public visibilityOptions: { name: string, value: number }[] = [
    { name: "Private", value: 0 },
    { name: "Friends Only", value: 1 },
    { name: "Registered Only", value: 2 },
    { name: "Public", value: 3 }
  ];

  public currentTags: tag[] = [];


  @Output() upload = new EventEmitter<upload>();
  @Output() cancelUpload = new EventEmitter<void>();

  addTag(): void {
    console.log(this.selectedIterator)
    // TODO: alert user that selected tag is a duplicate, or theres no selection
    if (this.selectedIterator) {
      const selectedTag:tag = this.validTags[this.selectedIterator];
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

  onSubmit(event: Event): void {
    if (this.mediaInstance) {
      var tagIDs: number[] = this.currentTags!.map(tag => tag.id);
      this.mediaInstance.tag_id_array = tagIDs;

      // TODO: input validation


      event.preventDefault();
      this.upload.emit(this.mediaInstance);
      var uploadForm = new FormData();


      uploadForm.append("image", this.mediaInstance.image!);
      uploadForm.append("placeholder_text", this.mediaInstance.placeholder_text!);
      uploadForm.append("description", this.mediaInstance.description!);
      uploadForm.append("visibility", this.mediaInstance.visibility!);
      uploadForm.append("tag_id_array", JSON.stringify(this.mediaInstance.tag_id_array!));

      this.MediaService.postMedia(uploadForm).subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err) => {
          alert(err);
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
