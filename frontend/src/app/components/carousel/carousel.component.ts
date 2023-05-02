import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { carousel } from 'src/app/models/carousel';
import { media } from 'src/app/models/media';
import { reaction_short } from 'src/app/models/reaction';
import { MediaService } from 'src/app/services/media/media.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { StoryService } from 'src/app/services/story/story.service';
import { CarouselComponent as NgxCarouselComponent } from 'ngx-bootstrap/carousel';
import { ErrorModel } from 'src/app/models/error';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  public reactions: reaction_short[];

  @ViewChild(NgxCarouselComponent) ngxCarousel: NgxCarouselComponent;
  @Input() public carousel: carousel;
  @Input() public iterator: number;
  @Input() public storyID: number;

  constructor(private CarouselService: StoryService, private ReactionsService: ReactionService, private MediaService: MediaService) {
    if (this.storyID) {
      this.CarouselService.getStoryByID(this.storyID).subscribe({
        error: (err) => {
          console.error(err)
        },
        next: (value) => {
          this.carousel = value ?? this.carousel;
        },
        complete: () => {
        },
      });
    };
  };

  ngOnInit(): void {
    if (this.carousel.reactions) {
      this.reactions = this.carousel.reactions;
      this.ReactionsService.setStoredInstanceList(this.reactions);
    };
    if (this.carousel.carousel_medialist) {
      const mediaList:media[] = this.carousel.carousel_medialist.map(instance => instance.media);
      this.MediaService.setLocalMediaList(mediaList);
    }
  };
};
