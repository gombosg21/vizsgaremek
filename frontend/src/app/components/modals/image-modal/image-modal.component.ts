import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { media } from 'src/app/models/media';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  @Input() public media: media;
  @Output() close = new EventEmitter<void>();
  @ViewChild('modalContent', { static: false }) modalContent: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.modalContent) {
      this.scrollToModal();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  private scrollToModal(): void {
    this.renderer.selectRootElement(this.modalContent.nativeElement).scrollIntoView({ behavior: 'smooth' });
  }

  
}
