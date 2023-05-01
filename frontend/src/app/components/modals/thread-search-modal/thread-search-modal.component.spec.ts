import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadSearchModalComponent } from './thread-search-modal.component';

describe('ThreadSearchModalComponent', () => {
  let component: ThreadSearchModalComponent;
  let fixture: ComponentFixture<ThreadSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadSearchModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
