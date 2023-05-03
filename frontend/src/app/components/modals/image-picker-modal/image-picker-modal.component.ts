import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaService } from 'src/app/services/media/media.service';

@Component({
  selector: 'app-image-picker-modal',
  templateUrl: './image-picker-modal.component.html',
  styleUrls: ['./image-picker-modal.component.css']
})
export class ImagePickerModalComponent {

  constructor(private MediaService:MediaService, private Auth:AuthService) {

  };

};
