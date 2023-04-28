import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTilesetComponent } from './media-tileset.component';

describe('MediaTilesetComponent', () => {
  let component: MediaTilesetComponent;
  let fixture: ComponentFixture<MediaTilesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaTilesetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTilesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
