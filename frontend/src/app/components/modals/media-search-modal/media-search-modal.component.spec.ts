import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSearchModalComponent } from './media-search-modal.component';

describe('MediaSearchModalComponent', () => {
  let component: MediaSearchModalComponent;
  let fixture: ComponentFixture<MediaSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaSearchModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
