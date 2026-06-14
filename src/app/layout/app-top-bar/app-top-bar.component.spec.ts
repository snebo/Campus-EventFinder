import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LucideAngularModule, Menu, User } from 'lucide-angular';

import { AppTopBarComponent } from './app-top-bar.component';

describe('AppTopBarComponent', () => {
  let fixture: ComponentFixture<AppTopBarComponent>;
  let component: AppTopBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopBarComponent, LucideAngularModule.pick({ Menu, User })],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function hamburger() {
    return fixture.debugElement.query(By.css('button[aria-label="Open menu"]'));
  }

  function avatar() {
    return fixture.debugElement.query(By.css('app-avatar-button button'));
  }

  function text() {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  it('renders hamburger, brand label (default "Eventfindr"), and avatar', () => {
    expect(hamburger()).toBeTruthy();
    expect(avatar()).toBeTruthy();
    expect(text()).toContain('Eventfindr');
  });

  it('does not override the brand to "CampusEvents"', () => {
    expect(text()).not.toContain('CampusEvents');
  });

  it('respects a provided brandName', () => {
    fixture.componentRef.setInput('brandName', 'My Brand');
    fixture.detectChanges();
    expect(text()).toContain('My Brand');
  });

  it('emits menuClick exactly once when the hamburger is clicked', () => {
    let count = 0;
    component.menuClick.subscribe(() => (count += 1));
    hamburger().nativeElement.click();
    expect(count).toBe(1);
  });

  it('emits avatarClick exactly once when the avatar is clicked', () => {
    let count = 0;
    component.avatarClick.subscribe(() => (count += 1));
    avatar().nativeElement.click();
    expect(count).toBe(1);
  });
});
