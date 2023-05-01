import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { carousel } from 'src/app/models/carousel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-carousel-tileset',
  templateUrl: './carousel-tileset.component.html',
  styleUrls: ['./carousel-tileset.component.css']
})
export class CarouselTilesetComponent {

  public carousels: carousel[];
  public cols: number = 1;
  private windowWidth: number = window.innerWidth;
  @Input() userID?: number;

  constructor(private route: ActivatedRoute, private CarouselService: StoryService, private AuthService: AuthService) {
    this.userID = this.route.snapshot.params['id'] ?? this.userID;

    if (this.userID) {
      this.CarouselService.getAllStoriesFromUserID(this.userID).subscribe({
        next: (value) => {
          if (value[0] != undefined) {
            this.carousels = value ?? this.carousels;
            this.CarouselService.setLocalStoryList(this.carousels);
          };
        },
        error: (err) => {
          console.error(err);
        }
      });
      switch (true) {
        case (this.windowWidth < 2000): {
          this.cols = 7;
          break;
        }
        case (this.windowWidth < 1600): {
          this.cols = 6;
          break;
        }
        case (this.windowWidth < 1200): {
          this.cols = 5;
          break;
        }
        case (this.windowWidth < 1000): {
          this.cols = 4;
          break;
        }
        case (this.windowWidth < 800): {
          this.cols = 3;
          break;
        }
        case (this.windowWidth < 600): {
          this.cols = 2;
          break;
        }
        case (this.windowWidth < 400): {
          this.cols = 1;
          break;
        }
        default: {
          this.cols = 1;
          console.error({ error: "cannot acces display size, using default column counts" })
        }
      };
    };
  };
};
