import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { thread_short, thread } from 'src/app/models/thread';
import { Router } from '@angular/router';
import { ThreadService } from 'src/app/services/thread/thread.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread-short',
  templateUrl: './thread-short.component.html',
  styleUrls: ['./thread-short.component.css']
})
export class ThreadShortComponent implements OnInit, OnDestroy {

  @Input() public threads: thread_short[];
  @Input() public mediaID: number;
  @Input() public carouselID: number;
  @Output() threadGet = new EventEmitter<thread>();
  private sessionSub: Subscription;
  public isSession: boolean = false;

  public NewThreadFormGroup = new FormGroup({
    NameFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)]))
  });

  constructor(private router: Router, private ThreadService: ThreadService, private Auth: AuthService) { };
  ngOnInit(): void {
    this.sessionSub = this.Auth.getSessionStatus.subscribe({
      next: (val) => { this.isSession = val },
      complete: () => { },
      error: (err) => { console.error(err) }
    });
  };
  ngOnDestroy(): void {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    };
  };

  open(ID: number): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    if(this.mediaID) {
    this.router.navigate(['media/' + this.mediaID + '/thread/' + ID]);
    };
    if(this.carouselID) {
      this.router.navigate(['carousel/' + this.carouselID + '/thread/' + ID]);
    };
    if(!this.carouselID && !this.mediaID) {
      console.error("no target ID given!")
    };
  };

  onSubmit(): void {
    if (this.NewThreadFormGroup.valid) {
      this.ThreadService.postCreateThread(this.NewThreadFormGroup.value.NameFormControl!).subscribe({
        next: (val) => { },
        complete: () => { },
        error: (err) => { console.error(err) }
      });
    };
  };

};
