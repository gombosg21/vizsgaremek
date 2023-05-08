import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public isSession: boolean = false;
  public sessionID?: number;
  public isDarkMode: boolean = false;

  public userProfileLinkBase: string = "/profile";
  public userMediasLinkBase: string = "/medias";
  public userStoriesLinkBase: string = "/carousels";

  public userProfileLink: string;
  public userMediasLink: string;
  public userStoriesLink: string;

  private authSub: Subscription;
  private userSub: Subscription;

  constructor(private Auth: AuthService, private router: Router) {
    this.router.events.subscribe({
      next: (value) => {
        this.authSub = this.Auth.getSessionStatus().subscribe({
          next: (value) => {
            this.isSession = value;
          },
          error: (err) => {
            console.error(err);
          }
        });
        this.userSub = this.Auth.getUserID().subscribe({
          next: (value) => {
            this.sessionID = value;            
            this.userMediasLink = this.userMediasLinkBase + "/" + this.sessionID;
            this.userProfileLink = this.userProfileLinkBase + "/" + this.sessionID;
            this.userStoriesLink = this.userStoriesLinkBase + "/" + this.sessionID;
          },
          error: (err) => {
            console.error(err)
          },
          complete: () => {
          }
        })
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode') || 'false');
        this.setDarkMode(this.isDarkMode);
      }
    });
  };

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.userSub.unsubscribe();
  };





  logout(): void {
    this.Auth.logout().subscribe({
      complete: () => {
      },
      error: (err) => {
        console.error(err);
      }
    });
  };


  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setDarkMode(this.isDarkMode);
  };

  setDarkMode(isDarkMode: boolean): void {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      this.setFormControlsTheme('dark-theme');

    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      this.setFormControlsTheme('light-theme');
    }
  }

  setFormControlsTheme(themeClass: string): void {
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach((formControl) => {
      formControl.classList.remove('light-theme', 'dark-theme');
      formControl.classList.add(themeClass);
    });
  };


  ngOnInit(): void {
    this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode') || 'false');
    this.setDarkMode(this.isDarkMode);
  };
};
