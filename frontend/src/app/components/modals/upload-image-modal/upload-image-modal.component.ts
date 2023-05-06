import { Component, EventEmitter, Output, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { upload } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';
import { MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith, of } from 'rxjs';


@Component({
  selector: 'app-upload-image-modal',
  templateUrl: './upload-image-modal.component.html',
  styleUrls: ['./upload-image-modal.component.css'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ]
})

export class UploadImageModalComponent implements OnInit {
  public validTags: tag[];
  public keycodes: number[] = [COMMA, ENTER];
  public filteredTags: Observable<tag[]> = of([]);
  public uploadTags: tag[] = [];
  @Output() upload = new EventEmitter<upload>();
  @Output() close = new EventEmitter<void>();
  @ViewChild("tagNameInput") tagInput: ElementRef<HTMLInputElement>;

  private mediaTagsControl: FormControl = new FormControl();
  public uploadFormGroup = new FormGroup({
    placeholderControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])),
    descriptionControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(500)])),
    visibilityControl: new FormControl<string>('', Validators.compose([Validators.min(0), Validators.max(3)])),
    imageControl: new FormControl('', Validators.compose([Validators.required])),
    tagIDArrayControl: new FormControl<number[]>([], Validators.compose([Validators.required]))
  });

  constructor(private MediaService: MediaService, private DBService: DbService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UploadImageModalComponent>) {
  };

  ngOnInit(): void {
    this.DBService.getAllCacheTags().subscribe({
      error: (err) => {
        console.error(err);
      },
      complete: () => {
      },
      next: (value) => {
        this.validTags = value;
        this.filteredTags = this.mediaTagsControl.valueChanges.pipe(
          startWith(null),
          map((tag: tag | null) => (tag ? this._filter(tag) : this.validTags.slice()))
        );
      },
    });
  };

  onImageSelected(event: any) {
    //TODO: input type validation
    this.uploadFormGroup.controls['imageControl'].setValue(event.target.files[0]);
  };

  addTag(event: MatChipInputEvent): void {
    const value = (event.value);
    if (value) {
      for (let i = 0; i < this.validTags.length; i++) {
        if (this.validTags[i].name == value) {
          if (!(this.uploadTags.includes(this.validTags[i]))) {
            this.uploadTags.push(this.validTags[i]);
            this.uploadFormGroup.controls['tagIDArrayControl'].setValue(this.uploadTags.map(Tag => Tag.ID));
          };
        };
      };
    };

    event.chipInput.clear();

    this.mediaTagsControl.setValue(null);
  };

  removeTag(tag: tag): void {
    const index = this.uploadTags.indexOf(tag);
    if (index > -1) {
      this.uploadTags.splice(index, 1);
      this.uploadFormGroup.controls['tagIDArrayControl'].setValue(this.uploadTags.map(Tag => Tag.ID));
    };
  };

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    for (let i = 0; i < this.validTags.length; i++) {
      if (this.validTags[i].name == event.option.viewValue)
        if (!(this.uploadTags.includes(this.validTags[i]))) {
          this.uploadTags.push(this.validTags[i])
          this.uploadFormGroup.controls['tagIDArrayControl'].setValue(this.uploadTags.map(Tag => Tag.ID));
        };
    };
    this.tagInput.nativeElement.value = '';
    this.mediaTagsControl.setValue(null);
    console.log(this.uploadFormGroup.controls)
  };

  onSubmit(): void {
    console.log(this.uploadFormGroup.valid)

    if (this.uploadFormGroup.valid) {
      const uploadForm = new FormData();

      uploadForm.append("image", this.uploadFormGroup.value.imageControl!);
      uploadForm.append("placeholder_text", this.uploadFormGroup.value.placeholderControl!);
      uploadForm.append("description", this.uploadFormGroup.value.descriptionControl!);
      uploadForm.append("visibility", String(this.uploadFormGroup.value.visibilityControl!));
      this.uploadFormGroup.value.tagIDArrayControl!.forEach(ID => {
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
          console.log("done");
          this.close.emit();
          this.dialogRef.close();
        }
      });
    } else {

    };
  };

  cancel(): void {
    this.close.emit();
    this.dialogRef.close();
  };

  private _filter(value: tag): tag[] {
    return this.validTags.filter(tag => tag === value);
  };
};
