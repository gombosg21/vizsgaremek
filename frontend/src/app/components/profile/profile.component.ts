import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { profile } from '../../models/profile';
import { thread } from '../../models/thread';
import { ThreadService } from '../../services/thread/thread.service';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public UserProfile: profile;
  public UserProfileThread: thread;
  public showAddReactions: boolean = false;
  public isSession: boolean = false;
  private userSub: Subscription;

  @Input() public userID: number;
  public newReactionID: number;

  constructor(private router: Router, private AuthService: AuthService, private UserService: UserService, private ThreadService: ThreadService, private ReactionsService: ReactionService) {
  };


  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
  };


  ngOnInit(): void {
    this.userSub = this.AuthService.getUserID.subscribe({
      next: (value) => {
        this.isSession = true;
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
            this.UserProfileThread = data.profile.thread;

            this.ThreadService.setLocalData = this.UserProfileThread;
            if (this.UserProfile.reactions) {
              this.ReactionsService.setStoredInstanceList = this.UserProfile.reactions;
            };
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
      },
    });
  };

  addReaction(reactionID: number): void {
    if (this.UserProfile.reactions) {
      for (let i = 0; i < this.UserProfile.reactions.length; i++) {
        if (this.UserProfile.reactions[i].ID == reactionID) {
          this.UserProfile.reactions[i].count++;
        };
      };
    };
    this.UserProfile.reactions = [{ ID: reactionID, count: 1 }];
    this.ReactionsService.setStoredInstanceList = this.UserProfile.reactions;
    this.newReactionID = reactionID;
  };

  editProfile(): void {
    this.router.navigate(["profile/edit"]);
  };

  react(): void {
    this.showAddReactions = true;
  };
};