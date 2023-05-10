import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { followed } from 'src/app/models/folowed';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FollowedService } from 'src/app/services/followed/followed.service';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css']
})
export class FollowedComponent implements OnDestroy, OnInit {

  private sessionIdSub: Subscription;
  public sessionId?: number;
  public subs?: followed[];

  constructor(private Auth: AuthService, private SubscriptionService: FollowedService, private router: Router) { };

  ngOnDestroy(): void {
    if (this.sessionIdSub) {
      this.sessionIdSub.unsubscribe();
    };
  };

  ngOnInit(): void {
    this.sessionIdSub = this.Auth.getUserID.subscribe({
      next: (val) => { this.sessionId = val },
      error: (err) => { console.error(err) },
      complete: () => { }
    });
    this.SubscriptionService.getLocalSubsList.subscribe({
      next: (val) => { this.subs = val },
      error: (err) => { console.error(err) },
      complete: () => { }
    });
  };

  visit(ID: number): void {
    this.router.navigate(['profile/' + ID]);
  };

  unsub(ID: number): void {
    this.SubscriptionService.deleteUnsub(ID).subscribe({
      next: (val) => {
        this.subs!.forEach(Sub => {
          if (Sub.ID == val) {
            this.subs!.splice(this.subs!.indexOf(Sub), 1);
          };
        });
        this.SubscriptionService.setLocalSubsList = this.subs!;
      },
      error: (err) => { console.error(err) },
      complete: () => { }
    });
  };

};
