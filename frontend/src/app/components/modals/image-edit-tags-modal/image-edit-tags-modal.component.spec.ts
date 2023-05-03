import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditTagsModalComponent } from './image-edit-tags-modal.component';

describe('ImageEditTagsModalComponent', () => {
  let component: ImageEditTagsModalComponent;
  let fixture: ComponentFixture<ImageEditTagsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageEditTagsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageEditTagsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
