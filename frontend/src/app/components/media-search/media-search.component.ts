import { Component, Output, EventEmitter, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { media } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';
import { Observable, map, startWith, of } from 'rxjs';
import { ErrorModel } from 'src/app/models/error';


@Component({
  selector: 'app-media-search',
  templateUrl: './media-search.component.html',
  styleUrls: ['./media-search.component.css']
})
export class MediaSearchComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() searchResults = new EventEmitter<(media | ErrorModel)[]>();

  @ViewChild("tagNameInput") tagInput: ElementRef<HTMLInputElement>;

  public keycodes: number[] = [COMMA, ENTER];
  public queryString: number[];
  public filteredTags: Observable<tag[]> = of([]);
  public queryTags: any[] = [];
  public validTags: tag[];
  private tagQueryControl: FormControl = new FormControl();


  constructor(private MediaService: MediaService, private DBService: DbService) {
    this.DBService.getAllCacheTags().subscribe({
      error: (err) => {
        console.error(err)
      },
      next: (value) => {
        this.validTags = value;
        this.filteredTags = this.tagQueryControl.valueChanges.pipe(
          startWith(null),
          map((tag: tag | null) => (tag ? this._filter(tag) : this.validTags.slice()))
        );
      },
      complete: () => {
      },
    });
  };

  ngOnInit(): void {

  };

  removeTag(tag: tag): void {
    const index = this.queryTags.indexOf(tag);
    if (index > -1) {
      this.queryTags.splice(index, 1);
    };
  };

  addTag(event: MatChipInputEvent): void {
    const value = (event.value);

    if (value) {
      for (let i = 0; i < this.validTags.length; i++) {
        if (this.validTags[i].name == value) {
          this.queryTags.push(this.validTags[i]);
        };
      };
    };

    event.chipInput.clear();

    this.tagQueryControl.setValue(null);
  };

  selectedTag(event: MatAutocompleteSelectedEvent): void {

    for (let i = 0; i < this.validTags.length; i++) {
      if (this.validTags[i].name == event.option.viewValue)
        this.queryTags.push(this.validTags[i])
    };
    this.tagInput.nativeElement.value = '';
    this.tagQueryControl.setValue(null);
  };

  search(): void {
    this.queryString = this.queryTags.map(tag => tag.ID);

    this.MediaService.getQueryMedia(this.queryString).subscribe({
      error: (err) => {
        console.error(err);
      },
      next: (value) => {
        console.log(value)
        this.searchResults.emit(value);
      },
      complete: () => {

      },
    });
  };

  private _filter(value: tag): tag[] {
    return this.validTags.filter(tag => tag === value);
  };

};
