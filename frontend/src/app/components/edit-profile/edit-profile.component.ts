import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs'
import { profile } from 'src/app/models/profile';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit, OnDestroy {

  public description: string;
  public ProfileGroup = new FormGroup({
    visibilityControl: new FormControl(''),
    aliasControl: new FormControl('', Validators.required)
  });

  public showImagePicker: boolean = false;
  public picture_ID: number;
  private userSub: Subscription;
  public UserProfile: profile;
  public userID: number | undefined;
  public profileImage?: string;



  constructor(private UserService: UserService, private Auth: AuthService) {
  };

  ngOnInit(): void {
    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => {
        this.userID = value ?? this.userID;

        this.UserService.getProfile(this.userID).subscribe({
          next: (data) => {
            this.UserProfile = {
              birth_date: data.birth_date,
              alias: data.profile.alias,
              description: data.profile.description,
              visibility: data.profile.visibility,
              picture_ID: data.profile.picture_ID,
              medium: data.profile.medium,
              reactions: data.profile.reactions,
              thread: data.profile.thread
            };
            this.picture_ID = this.UserProfile.picture_ID;
            this.description = this.UserProfile.description;
            this.ProfileGroup.setValue({ visibilityControl: String(this.UserProfile.visibility), aliasControl: this.UserProfile.alias});
            this.profileImage = this.UserProfile.medium?.file_data;
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
      },
    });
  };

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
  };


  showPicker(): void {
    this.showImagePicker = true;
  };

  hidePicker(): void {
    this.showImagePicker = false;
  };

  setImageID(ID: number): void {
    this.picture_ID = ID;
  };

  setImageData(data: string): void {
    this.profileImage = data;
  };

  finishEdit(): void {

    const Data = {
      description: this.description,
      visibility:  Number(this.ProfileGroup.value.visibilityControl),
      alias: this.ProfileGroup.value.aliasControl!,
      picture_ID: this.picture_ID
    };

    this.UserService.updateProfile(Data).subscribe({
      next: (val) => { },
      complete: () => { },
      error: (err) => { console.error(err) }
    });
  };
};

