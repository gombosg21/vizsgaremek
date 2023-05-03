import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';
import { media } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { startWith, map, of, Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-image-edit-tags-modal',
  templateUrl: './image-edit-tags-modal.component.html',
  styleUrls: ['./image-edit-tags-modal.component.css']
})
export class ImageEditTagsModalComponent implements OnDestroy, OnInit {

  @ViewChild("tagNameInput") tagInput: ElementRef<HTMLInputElement>;
  @Output() addedTags: EventEmitter<tag[]> = new EventEmitter<tag[]>();
  @Output() removedTags: EventEmitter<tag[]> = new EventEmitter<tag[]>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
  @Input() media: media;

  private removeTagList: tag[] = [];
  private addTagList: tag[] = [];
  public validTags: tag[];
  public keycodes: number[] = [COMMA, ENTER];
  public filteredTags: Observable<tag[]> = of([]);
  public currentTags: tag[];
  private tagUpdateControl: FormControl = new FormControl();

  constructor(private DBService: DbService, private MediaServie: MediaService) {
    this.DBService.getAllCacheTags().subscribe({
      next: (value) => {
        this.validTags = value;
        this.filteredTags = this.tagUpdateControl.valueChanges.pipe(
          startWith(null),
          map((tag: tag | null) => (tag ? this._filter(tag) : this.validTags.slice()))
        );
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {

      }
    })
  };

  ngOnInit(): void {
    if (this.media.tags) {
      this.currentTags = this.media.tags;
    };
  };

  close(): void {
    this.closed.emit();
  };

  submit(): void {
    this.closed.emit();

    switch (true) {
      case (this.addTagList.length != 0 && this.removeTagList.length != 0): {

        const addIDs = this.addTagList.map(tag => tag.ID);
        const removeIDs = this.removeTagList.map(tag => tag.ID);
        this.MediaServie.postUpdateMediaTags(this.media.ID!, addIDs, removeIDs).subscribe({
          next: (value) => {
            this.addedTags.emit(this.addTagList);
            this.removedTags.emit(this.removeTagList);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
          }
        });
        break;
      }
      case (this.addTagList.length != 0): {
        const addIDs = this.addTagList.map(tag => tag.ID);
        this.MediaServie.postUpdateMediaTags(this.media.ID!, addIDs).subscribe({
          next: (value) => {
            this.addedTags.emit(this.addTagList);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
          }
        });
        break;
      }
      case (this.removeTagList.length != 0): {
        if(this.removeTagList.length == this.media.tags?.length) {
          //no complete de-tagging
          break;
        };
        const removeIDs = this.removeTagList.map(tag => tag.ID);
        this.MediaServie.postUpdateMediaTags(this.media.ID!, removeIDs).subscribe({
          next: (value) => {
            this.removedTags.emit(this.removeTagList);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
          }
        });
        break;
      }
      default: {
        //no changes made, user hit submit even they shouldnt had.
        break;
      };
    };
  };

  ngOnDestroy(): void {

  };

  removeTag(tag: tag): void {
    if (this.media.tags) {
      const index = this.currentTags.indexOf(tag);
      if (this.media.tags.indexOf(tag) != -1) {
        this.removeTagList.push(tag);
        this.currentTags.splice(index, 1);
      };
    };
  };

  addTag(event: MatChipInputEvent): void {
    const value = (event.value);

    if (value) {

      for (let i = 0; i < this.validTags.length; i++) {
        if (this.validTags[i].name == value) {
          this.addTagList.push(this.validTags[i]);
          this.currentTags.push(this.validTags[i]);
        };
      };
    };

    event.chipInput.clear();

    this.tagUpdateControl.setValue(null);
  };

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    for (let i = 0; i < this.validTags.length; i++) {
      if (this.validTags[i].name == event.option.viewValue)
        this.addTagList.push(this.validTags[i])
    };
    this.tagInput.nativeElement.value = '';
    this.tagUpdateControl.setValue(null);
  };

  private _filter(value: tag): tag[] {
    return this.validTags.filter(tag => tag === value);
  };
};


