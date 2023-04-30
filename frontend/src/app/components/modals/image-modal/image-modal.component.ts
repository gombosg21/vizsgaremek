import { Component, EventEmitter, Input, Output } from '@angular/core';
import { media } from 'src/app/models/media';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {

  @Input() public media:media;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  };
};
