import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSearchModalComponent } from './carousel-search-modal.component';

describe('CarouselSearchModalComponent', () => {
  let component: CarouselSearchModalComponent;
  let fixture: ComponentFixture<CarouselSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselSearchModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
