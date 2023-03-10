import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  @Output() upload = new EventEmitter<{ image: string, likes: number, description: string }>();
  @Output() cancelUpload = new EventEmitter<void>();
  newPost = { image: '', likes: 0, description: '' };

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    if (event.target != null) {
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        if (event.target != null) {
          this.newPost.image = event.target.result as string;
        }
      };
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.upload.emit(this.newPost);
    this.newPost.image = '';
    this.newPost.description = '';
    setTimeout(() => {
      this.cancel();
    }, 1000);
  }

  cancel(): void {
    this.newPost.image = '';
    this.newPost.description = '';
    this.cancelUpload.emit();
  }
}
