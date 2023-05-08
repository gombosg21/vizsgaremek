import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselBuilderComponent } from './carousel-builder.component';

describe('CarouselBuilderComponent', () => {
  let component: CarouselBuilderComponent;
  let fixture: ComponentFixture<CarouselBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
