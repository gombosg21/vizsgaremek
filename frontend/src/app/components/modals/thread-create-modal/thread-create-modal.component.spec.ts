import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadCreateModalComponent } from './thread-create-modal.component';

describe('ThreadCreateModalComponent', () => {
  let component: ThreadCreateModalComponent;
  let fixture: ComponentFixture<ThreadCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadCreateModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
