import { Component, Input } from '@angular/core';
import { user } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  public description: string;
  public visibility: number;
  public alias: string;
  public showImagePicker: boolean = false;

  @Input() public picture_ID: number;
  @Input() UserProfile: user;

  constructor(private UserService: UserService) {
  };

  showPicker(): void {
    this.showImagePicker = true;
  };

  hidePicker(): void {
    this.showImagePicker = false;
  };

  finishEdit(): void {

    const Data = {
      description: this.description,
      visibility: this.visibility,
      alias: this.alias,
      picture_ID: this.picture_ID
    };

    this.UserService.updateProfile(Data).subscribe({
      next: () => { },
      complete: () => { },
      error: () => { }
    });
  };
};

