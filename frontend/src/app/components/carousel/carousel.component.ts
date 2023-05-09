import { Component, OnInit, OnDestroy ,Input, ViewChild } from '@angular/core';
import { carousel } from 'src/app/models/carousel';
import { reaction_short } from 'src/app/models/reaction';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { StoryService } from 'src/app/services/story/story.service';
import { ErrorModel } from 'src/app/models/error';
import { CarouselComponent as NgxCarouselComponent, SlideComponent } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {

  public reactions: reaction_short[];

  @ViewChild(NgxCarouselComponent) ngxCarousel: NgxCarouselComponent;
  @Input() public data: carousel | ErrorModel;
  @Input() public iterator: number;
  @Input() public carouselID: number;
  @Input() public ErrorInstance: ErrorModel;
  public showAddReactions:boolean = false;
  public carousel: carousel;
  public carousel_components: any[];

  constructor(private CarouselService: StoryService, private ReactionsService: ReactionService) {
  };
  ngOnDestroy(): void {};

  ngOnInit(): void {
    if (this.carouselID) {
      this.CarouselService.getStoryByID(this.carouselID).subscribe({
        error: (err) => {
          console.error(err);
        },
        next: (value) => {
          if (value.hasOwnProperty('carousel_medialists')) {
            this.carousel = value as carousel ?? this.carousel;
          };
          if (value.hasOwnProperty('error')) {
            this.ErrorInstance = value as ErrorModel;
          };
        },
        complete: () => {
        },
      });
    };

    if (this.data) {
      if (this.data.hasOwnProperty('carousel_medialists')) {
        this.carousel = this.data as carousel;
      } else {
        this.ErrorInstance = this.data as ErrorModel;
      };
    };


    if (this.carousel) {
      if (this.carousel.reactions) {
        this.reactions = this.carousel.reactions;
        this.ReactionsService.setStoredInstanceList = this.reactions;
      };
      if (this.carousel.carousel_medialists) {
        console.log(this.carousel.carousel_medialists[0].media)
        this.carousel_components = (this.carousel.carousel_medialists.sort((a, b) => b.item_number - a.item_number))
          .map(item => ({ file_data: item.media[0].file_data, description: item.item_description, title: item.media[0].placeholder_text }));
      };
    };
  };

  react(): void {
    this.showAddReactions = true;
  };

  addReaction(reactionID:number):void {
    if (this.carousel) {
      if (this.carousel.reactions) {
        for (let i = 0; i < this.carousel.reactions.length; i++) {
          if (this.carousel.reactions[i].ID == reactionID) {
            this.carousel.reactions[i].count++;
          };
        };
      };
      this.carousel.reactions = [{ ID: reactionID, count: 1 }];
      this.ReactionsService.setStoredInstanceList = this.carousel.reactions;
    };
  };

};
