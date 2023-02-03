import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty username and password upon initialization', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('should log the username and password to the console upon form submission', () => {
    spyOn(console, 'log');
    component.username = 'testUsername';
    component.password = 'testPassword';
    component.login();
    expect(console.log).toHaveBeenCalledWith('testUsername', 'testPassword');
  });
});
