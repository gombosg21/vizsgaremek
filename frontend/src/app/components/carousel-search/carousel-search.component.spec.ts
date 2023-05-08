import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSearchComponent } from './carousel-search.component';

describe('CarouselSearchComponent', () => {
  let component: CarouselSearchComponent;
  let fixture: ComponentFixture<CarouselSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
