import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { pending_friend, verified_friend } from 'src/app/models/friend';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FriendsService } from 'src/app/services/friends/friends.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnDestroy, OnInit {

  @Input() public userID: number;

  public friendList: verified_friend[];
  public pendingList: pending_friend[];

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
  };

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
  };

  unFriend(friend: verified_friend): void {
    this.FriendsService.deleteUnfriend(friend.ID).subscribe({
      next: (val) => {
        this.friendList.splice(this.friendList.indexOf(friend), 1);
        this.friendList = [...this.friendList];
      },
      error: (err) => {
        console.error(err);
      }, complete: () => {

      }
    })
  };

  rejectRequest(friend: pending_friend): void {
    this.FriendsService.deleteRejectFriendRequest(friend.ID).subscribe({
      next: (val) => {
        this.pendingList.splice(this.friendList.indexOf(friend), 1);
        this.friendList = [...this.friendList];
      },
      error: (err) => { console.error(err); },
      complete: () => { }
    });
  };

  acceptRequest(friend: pending_friend): void {
    this.FriendsService.patchVerifyRequest(friend.ID).subscribe({
      next: (val) => {
        this.pendingList.splice(this.friendList.indexOf(friend), 1);
        this.friendList = [...this.friendList];
        this.friendList.push(friend as verified_friend);
        this.friendList = [...this.friendList];
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => { }
    });
  };

  requestFriendShip(targetID: number): void {
    this.FriendsService.postRequestFriend(targetID).subscribe({
      next: (val) => { },
      error: (err) => { 
        console.error(err); 
      },
      complete: () => { },
    });
  };

  visitProfile(friend: verified_friend | pending_friend): void {

  };

};
