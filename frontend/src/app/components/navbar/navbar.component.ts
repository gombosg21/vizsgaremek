import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showSearch = false;
  showUpload = false;
  isSession = false;
  isDarkMode = false;

  constructor(private Auth: AuthService, private router: Router) {
    router.events.subscribe({
      next: (value) => {
        this.isSession = this.Auth.activeToken();
        this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode') || 'false');
    this.setDarkMode(this.isDarkMode);
      }
    });
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    this.showUpload = false;
    // document.body.style.overflow = this.showSearch ? 'hidden' : 'auto'; // disable scrolling
  }

  toggleUpload(): void {
    this.showUpload = !this.showUpload;
    this.showSearch = false;
    document.body.style.overflow = this.showUpload ? 'hidden' : 'auto'; // disable scrolling
  }

  closeSearch(): void {
    this.showSearch = false;
    document.body.style.overflow = 'auto'; // enable scrolling
  }

  logout() {
    this.Auth.logout().subscribe({
      complete: () => {
        this.isSession = this.Auth.activeToken();
      }
    });
  }


  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setDarkMode(this.isDarkMode);
  }

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
  }
  ngOnInit(): void {
    this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode') || 'false');
    this.setDarkMode(this.isDarkMode);
  }
  
}
