import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselThreadComponent } from './carousel-thread.component';

describe('CarouselThreadComponent', () => {
  let component: CarouselThreadComponent;
  let fixture: ComponentFixture<CarouselThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselThreadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
