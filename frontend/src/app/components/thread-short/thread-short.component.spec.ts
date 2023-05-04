import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadShortComponent } from './thread-short.component';

describe('ThreadShortComponent', () => {
  let component: ThreadShortComponent;
  let fixture: ComponentFixture<ThreadShortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadShortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
