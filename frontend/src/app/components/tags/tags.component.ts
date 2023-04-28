import { Component, Input } from '@angular/core';
import { tag } from 'src/app/models/tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {

  constructor() {

  }
  @Input() tags: tag[];

}
