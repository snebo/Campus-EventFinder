import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { GraduationCap, LucideAngularModule, Menu, User, X } from 'lucide-angular';

import { AppShellComponent } from './app-shell.component';

@Component({ selector: 'app-dummy', template: '' })
class DummyComponent {}

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent, LucideAngularModule.pick({ GraduationCap, Menu, User, X })],
      providers: [
        provideRouter([
          { path: 'home', component: DummyComponent },
          { path: 'account', component: DummyComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
  });

  function panel() {
    return fixture.debugElement.query(By.css('[data-testid="nav-drawer-panel"]'));
  }

  it('renders the top bar and an initially hidden drawer', () => {
    expect(fixture.debugElement.query(By.css('app-top-bar'))).toBeTruthy();
    expect(panel()).toBeNull();
  });

  it('opens the drawer on menuClick and closes it on the drawer close event', () => {
    fixture.debugElement.query(By.css('button[aria-label="Open menu"]')).nativeElement.click();
    fixture.detectChanges();
    expect(panel()).toBeTruthy();

    fixture.debugElement.query(By.css('[data-testid="nav-drawer-backdrop"]')).nativeElement.click();
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('navigates to /account on avatarClick', () => {
    const navigate = vi.spyOn(router, 'navigate');
    fixture.debugElement.query(By.css('app-avatar-button button')).nativeElement.click();
    expect(navigate).toHaveBeenCalledWith(['/account']);
  });

  it('derives activeRoute from the current URL and marks the matching nav link active', async () => {
    await router.navigate(['/home']);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button[aria-label="Open menu"]')).nativeElement.click();
    fixture.detectChanges();

    const anchors = fixture.debugElement
      .queryAll(By.css('app-nav-link-item a'))
      .map((a) => a.nativeElement as HTMLElement);
    const bold = anchors.filter((a) => a.classList.contains('font-semibold'));
    expect(bold.length).toBe(1);
    expect(bold[0].textContent?.trim()).toBe('Home');
  });
});
