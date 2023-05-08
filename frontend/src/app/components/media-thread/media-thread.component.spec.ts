import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaThreadComponent } from './media-thread.component';

describe('MediaThreadComponent', () => {
  let component: MediaThreadComponent;
  let fixture: ComponentFixture<MediaThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaThreadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
