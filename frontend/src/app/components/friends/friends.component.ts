import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FriendsService } from 'src/app/services/friends/friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnDestroy, OnInit {

  constructor(private FriendsService: FriendsService, private Auth: AuthService) {

  };

  ngOnInit(): void {

  };
  ngOnDestroy(): void {

  };

};
