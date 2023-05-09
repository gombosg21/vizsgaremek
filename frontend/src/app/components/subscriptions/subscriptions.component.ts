import { Component, OnInit, OnDestroy } from '@angular/core';
import { FollowedService } from 'src/app/services/followed/followed.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnDestroy, OnInit {

  public subsList: any[];

  constructor(private SubscriberService: FollowedService) { };

  ngOnDestroy(): void {
    this.SubscriberService.getSubs().subscribe({
      next: (val) => {
        this.subsList = val;
      },
      error: (err) => { console.error(err) },
      complete: () => { }
    })
  };

  ngOnInit(): void {
  };

};
