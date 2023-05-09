import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { media } from 'src/app/models/media';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaService } from 'src/app/services/media/media.service';
import { StoryService } from 'src/app/services/story/story.service';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-carousel-builder',
  templateUrl: './carousel-builder.component.html',
  styleUrls: ['./carousel-builder.component.css']
})
export class CarouselBuilderComponent implements OnInit {

  @Output() cancelled: EventEmitter<void> = new EventEmitter<void>();
  public medias: media[] = [];
  public slides: { item_description: string, media: media }[]= [];

  public storyNewFormGroup = new FormGroup({
    nameFormControl: new FormControl<string>('', Validators.compose([Validators.required])),
    descriptionFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(300)])),
    visibilityFormControl: new FormControl<number>(0, Validators.compose([Validators.required])),
    mediaArrayControl: new FormArray<FormGroup>([], Validators.compose([Validators.required, Validators.minLength(2)]))
  });

  public mediaItemFormGroup = new FormGroup({
    mediaIDFormControl: new FormControl<number>(-1, Validators.compose([Validators.required, Validators.min(0)])),
    mediaOrderNumberFormControl: new FormControl<number>(-1, Validators.compose([Validators.required, Validators.min(0)])),
    mediaDescriptionFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(300)]))
  });

  constructor(private StoryService: StoryService, private Auth: AuthService, private MediaService: MediaService) { };

  ngOnInit(): void {
    this.MediaService.getAllMediaFromUserID().subscribe({
      next: (val) => {
        val.forEach(item => {
          if (Object.hasOwn(item, 'ID')) {
            this.medias.push(item as media);
          };
        });
      }, error: (err) => {
        console.error(err);
      },
      complete: () => { }
    });
  };

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      var dragItem = event.previousContainer.data[event.previousIndex];
      if(Object.hasOwn(dragItem,"item_description")) {
        delete dragItem.item_description;
        dragItem = dragItem.media as media;
      } else {
        dragItem = {
          media: dragItem,
          item_description: "",
        }
        dragItem = dragItem as { item_description: string, media: media };
      };
      console.log(event)

      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    };
  };


  onSubmit(): void {
    console.log(this.storyNewFormGroup.value)
  };

  cancelBuild(): void {
    this.cancelled.emit();
  };

};
