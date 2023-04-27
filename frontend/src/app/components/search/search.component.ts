import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() close = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

  constructor(private router: Router) {}

  toggleBodyScroll(): void {
    document.body.classList.toggle('no-scroll');
  }
  
  closeSearch(): void {
    this.toggleBodyScroll();
    this.close.emit();
  }
  
  search(query: string): void {
    this.toggleBodyScroll();
    this.searchQuery.emit(query);
    this.close.emit();
    this.router.navigate(['/query'], { queryParams: { searchTerm: query } });
  }
  
}
