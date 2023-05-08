import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReactionsComponent } from './admin-reactions.component';

describe('AdminReactionsComponent', () => {
  let component: AdminReactionsComponent;
  let fixture: ComponentFixture<AdminReactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
