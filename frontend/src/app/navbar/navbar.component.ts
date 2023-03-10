import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showSearch = false;
  showUpload = false;

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
}
