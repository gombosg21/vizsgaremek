import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageModalComponent } from './upload-image-modal.component';

describe('UploadComponent', () => {
  let component: UploadImageModalComponent;
  let fixture: ComponentFixture<UploadImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadImageModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
