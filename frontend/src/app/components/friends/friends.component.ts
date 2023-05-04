import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { pending_friend, verified_friend } from 'src/app/models/friend';
import { user_short } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FriendsService } from 'src/app/services/friends/friends.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnDestroy, OnInit {

  @Input() public userID: number;

  private friendList: verified_friend[];
  public pendingList: pending_friend[];
  public filteredFriendList: user_short[];

  private userSub: Subscription;

  constructor(private FriendsService: FriendsService, private Auth: AuthService) {
    this.userSub = this.Auth.getUserID().subscribe({
      next: (val) => {
        this.userID = this.userID ?? val;
      }
    });
  };

  ngOnInit(): void {
    this.FriendsService.getFriendList(this.userID).subscribe({
      error: (err) => { console.error(err); },
      next: (value) => {
        console.log(value)
        this.friendList = value;
      },
      complete: () => { }
    });

    this.FriendsService.getPendingList().subscribe({
      error: (err) => {
        console.error(err);
      },
      next: (value) => {
        this.pendingList = value;
      },
      complete: () => {

      }
    });

    this.friendList.forEach(item => {
      if (item.friend_ID.ID != this.userID) { this.filteredFriendList.push(item.friend_ID) };
      if (item.user_ID.ID != this.userID) { this.filteredFriendList.push(item.user_ID) };
    });

    this.friendList = [...this.friendList];
  };

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
  };

};
