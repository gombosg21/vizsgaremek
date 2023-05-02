import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { profile } from '../../models/profile';
import { thread } from '../../models/thread';
import { ThreadService } from '../../services/thread/thread.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public UserProfile: profile;
  public UserProfileThread: thread;

  @Input() public userID: number;

  constructor(private AuthService: AuthService, private UserService: UserService, private ThreadService: ThreadService, private ReactionsService: ReactionService) {
  };

  ngOnInit(): void {
    this.AuthService.getUserID().subscribe({
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
            }

            this.UserProfileThread = {
              name: data.profile.thread.name,
              ID: data.profile.thread.ID,
              status: data.profile.thread.status,
              created: data.profile.thread.created,
              last_activity: data.profile.thread.last_activity,
              reactions: data.profile.thread.reactions,
              comments: data.profile.thread.comments,
              user: data.profile.thread.user
            }

            this.ThreadService.setLocalData(this.UserProfileThread);
            if (this.UserProfile.reactions) {
              this.ReactionsService.setStoredInstanceList(this.UserProfile.reactions);
            };
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
};