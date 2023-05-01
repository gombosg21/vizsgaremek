import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { media } from 'src/app/models/media';
import { tag } from 'src/app/models/tag';
import { DbService } from 'src/app/services/db/db.service';
import { MediaService } from 'src/app/services/media/media.service';


@Component({
  selector: 'app-media-search-modal',
  templateUrl: './media-search-modal.component.html',
  styleUrls: ['./media-search-modal.component.css']
})
export class MediaSearchModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() searchResults = new EventEmitter<media[]>();

  public queryString:string;
  private validTags:tag[];


  constructor(private MediaService:MediaService, private DBService:DbService) {
    this.DBService.getAllCacheTags().subscribe({
      error:(err) => {
        console.error(err)
      },
      next:(value) => {
        this.validTags = value;
      },
      complete:() => {
        
      },
    })
  }

  ngOnInit(): void {
    
  }

  searchChanged(data:string) {

  }

  search() {
    this.MediaService.getQueryMedia(this.queryString).subscribe({
      error:(err) => {
        console.error(err);
      },
      next:(value) => {
        this.searchResults.emit(value);
      },
      complete:() => {
        
      },
    });
  };

}
