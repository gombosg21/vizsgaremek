import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-carousel-search',
  templateUrl: './carousel-search.component.html',
  styleUrls: ['./carousel-search.component.css']
})
export class CarouselSearchComponent {
  constructor(private StoryService: StoryService) { };

  public searchFormGroup = new FormGroup({
    dateCreatedStartFormControl: new FormControl<Date>(new Date(),),
    dateCreatedEndFormControl: new FormControl<Date>(new Date(),),
    nameFormControl: new FormControl<string>('',),
    userIDFormControl: new FormControl<number>(0,),
    descriptionFormControl: new FormControl<string>('',),
    mediaIDsFormControl: new FormControl<number[]>([],),
    dateEditStartFormControl: new FormControl<Date>(new Date(),),
    dateEndFormControl: new FormControl<Date>(new Date(),)
  });


};
