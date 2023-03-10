import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  @Input() imageSrc = '';
  @Input() description = '';
  @Input() likes = 0;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
