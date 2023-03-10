import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  searchTerm: string;
  searchResults: string[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'];
      this.searchResults = ['test 1', 'test 2', 'test 3'];
    });
  }
}
