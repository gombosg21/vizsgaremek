import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { media } from 'src/app/models/media';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-carousel-builder',
  templateUrl: './carousel-builder.component.html',
  styleUrls: ['./carousel-builder.component.css']
})
export class CarouselBuilderComponent implements OnInit {

  @Input() media: media;

  public displayModal: boolean = false;
  private selectedIndex:number;

  public storyNewFormGroup = new FormGroup({
    nameFormControl: new FormControl<string>('', Validators.compose([Validators.required])),
    descriptionFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(300)])),
    visibilityFormControl: new FormControl<number>(0, Validators.compose([Validators.required])),
    mediaArrayControl: new FormArray<FormGroup>([], Validators.compose([Validators.required, Validators.minLength(2)]))
  });

  public mediaItemFormGroup = new FormGroup({
    mediaIDFormControl: new FormControl<number>(-1, Validators.compose([Validators.required])),
    mediaOrderNumberFormControl: new FormControl<number>(-1, Validators.compose([Validators.required])),
    mediaDescriptionFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(300)]))
  });

  constructor(private StoryService: StoryService) { 

  };

  addMediaID(mediaID: number): void {
    this.storyNewFormGroup.value.mediaArrayControl![this.selectedIndex].mediaItemFormGroup.value.mediaIDFormControl = mediaID;
  };

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  };

  addFormArrayGroupItem() {
    this.storyNewFormGroup.value.mediaArrayControl!.push(this.mediaItemFormGroup);
  };

  removeFormArrayGroupItem(group: FormGroup) {
    this.storyNewFormGroup.value.mediaArrayControl!.splice(this.storyNewFormGroup.value.mediaArrayControl!.indexOf(group), 1);
  };

  editFormArrayGroupItem(group: FormGroup, index: number) {
    this.storyNewFormGroup.value.mediaArrayControl![index] = group;
  };

  showModal(selectedIndex:number): void {
    this.selectedIndex = selectedIndex;
    this.displayModal = true;
  };

  hideModal(): void {
    this.displayModal = false;
  };

  onSubmit(): void {
    console.log(this.storyNewFormGroup)
  };

};
