import { Component , OnInit , Input } from '@angular/core';
import { carousel } from 'src/app/models/carousel';
import { reaction_short } from 'src/app/models/reaction';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  public reactions:reaction_short[];

  @Input() public carousel:carousel;
  @Input() public iterator:number;
  @Input() public storyID:number;

  constructor(private CarouselService: StoryService, private ReactionsService: ReactionService) {
    if(this.storyID) {
      this.CarouselService.getStoryByID(this.storyID).subscribe({
        error:(err) => {
          console.log(err)
        },
        next:(value) => {
          this.carousel = value;
          this.carousel.carousel_medialist[0].media
        },
        complete:() => {
        },
      });
    };
  };

  ngOnInit(): void {
    console.log(this.carousel)
    if (this.carousel.reactions) {
      this.reactions = this.carousel.reactions;
      this.ReactionsService.setStoredInstanceList(this.reactions);
    };
  };
};
