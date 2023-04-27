import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showSearch = false;
  showUpload = false;
  isSession = false;

  constructor(private Auth: AuthService, private router: Router) {

    router.events.subscribe({
      next: (value) => {
        this.isSession = this.Auth.activeToken();
      }
    })
  }

  toggleSearch(): void {
    this.showSearch = true;
    document.body.style.overflow = 'hidden'; //disable scrolling
  }

  toggleUpload(): void {
    this.showUpload = !this.showUpload;
    document.body.style.overflow = this.showUpload ? 'hidden' : 'auto'; // disable scrolling 
  }

  closeSearch(): void {
    this.showSearch = false;
    document.body.style.overflow = 'auto'; // enable scrolling
  }

  logout() {
    this.Auth.logout().subscribe({
      error: (error) => { console.error({ error: error }) },
      complete: () => { this.router.navigate(["/login"]) },
    });
  };
}
