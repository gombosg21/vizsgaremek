import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { carousel } from 'src/app/models/carousel';
import { media } from 'src/app/models/media';
import { reaction_short } from 'src/app/models/reaction';
import { MediaService } from 'src/app/services/media/media.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { StoryService } from 'src/app/services/story/story.service';
import { CarouselComponent as NgxCarouselComponent, SlideComponent } from 'ngx-bootstrap/carousel';
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
  public carousel_components: any[];

  constructor(private CarouselService: StoryService, private ReactionsService: ReactionService) {
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
    if (this.carousel.carousel_medialists) {
      console.log(this.carousel.carousel_medialists[0].media)
      this.carousel_components = (this.carousel.carousel_medialists.sort((a, b) => b.item_number - a.item_number))
        .map(item => ({ file_data: item.media[0].file_data, description: item.item_description, title: item.media[0].placeholder_text }));

        console.log(this.carousel_components)
    };
  };
};
