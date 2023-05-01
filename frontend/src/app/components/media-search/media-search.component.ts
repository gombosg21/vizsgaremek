import { Component, Output, EventEmitter, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { media } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';
import { Observable, map, startWith } from 'rxjs';


@Component({
  selector: 'app-media-search',
  templateUrl: './media-search.component.html',
  styleUrls: ['./media-search.component.css']
})
export class MediaSearchComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() searchResults = new EventEmitter<media[]>();

  @ViewChild("tagNameInput") tagInput: ElementRef<HTMLInputElement>;

  public keycodes: number[] = [COMMA, ENTER];
  public queryString: string;
  public filteredTags: Observable<tag[]>;
  public queryTags: tag[] = [];
  public validTags: tag[];
  private tagQueryControl:FormControl = new FormControl();


  constructor(private MediaService: MediaService, private DBService: DbService) {
    this.DBService.getAllCacheTags().subscribe({
      error: (err) => {
        console.error(err)
      },
      next: (value) => {
        this.validTags = value;
      },
      complete: () => {
      },
    });

    this.filteredTags = this.tagQueryControl.valueChanges.pipe(
      startWith(null),
      map((tag:tag | null) =>(tag ? this._filter(tag): this.validTags.slice()))
    )
  };

  ngOnInit(): void {

  };

  searchChanged(data: string) {

  };

  search() {
    this.MediaService.getQueryMedia(this.queryString).subscribe({
      error: (err) => {
        console.error(err);
      },
      next: (value) => {
        this.searchResults.emit(value);
      },
      complete: () => {

      },
    });
  };

  private _filter(value:tag):tag[] {
    return this.validTags.filter(tag => tag === value);
  };

};
