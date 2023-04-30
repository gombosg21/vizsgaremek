import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselTilesetComponent } from './carousel-tileset.component';

describe('CarouselTilesetComponent', () => {
  let component: CarouselTilesetComponent;
  let fixture: ComponentFixture<CarouselTilesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselTilesetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselTilesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
