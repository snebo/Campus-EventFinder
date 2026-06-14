import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { GraduationCap, LucideAngularModule, X } from 'lucide-angular';

import { NavDrawerComponent } from './nav-drawer.component';

describe('NavDrawerComponent', () => {
  let fixture: ComponentFixture<NavDrawerComponent>;
  let component: NavDrawerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavDrawerComponent, LucideAngularModule.pick({ GraduationCap, X })],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavDrawerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
  });

  function panel() {
    return fixture.debugElement.query(By.css('[data-testid="nav-drawer-panel"]'));
  }

  function backdrop() {
    return fixture.debugElement.query(By.css('[data-testid="nav-drawer-backdrop"]'));
  }

  function links() {
    return fixture.debugElement.queryAll(By.css('app-nav-link-item'));
  }

  function open(): void {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  }

  it('renders neither panel nor backdrop when open=false', () => {
    expect(panel()).toBeNull();
    expect(backdrop()).toBeNull();
  });

  it('uses the default Home/Search/Schedule/Account links and renders one per entry when open', () => {
    open();

    expect(backdrop()).toBeTruthy();
    expect(panel()).toBeTruthy();
    expect(fixture.debugElement.query(By.css('button[aria-label="Close menu"]'))).toBeTruthy();
    expect(links().map((l) => l.query(By.css('a')).nativeElement.textContent.trim())).toEqual([
      'Home',
      'Search',
      'Schedule',
      'Account',
    ]);
  });

  it('marks only the link matching activeRoute as active', () => {
    fixture.componentRef.setInput('activeRoute', '/search');
    open();

    const anchors = links().map((l) => l.query(By.css('a')).nativeElement as HTMLElement);
    const bold = anchors.filter((a) => a.classList.contains('font-semibold'));
    expect(bold.length).toBe(1);
    expect(bold[0].textContent?.trim()).toBe('Search');
  });

  it('emits close when the close icon, backdrop, or a link is clicked', () => {
    open();
    let count = 0;
    component.close.subscribe(() => (count += 1));

    fixture.debugElement.query(By.css('button[aria-label="Close menu"]')).nativeElement.click();
    backdrop().nativeElement.click();
    links()[0].nativeElement.click();

    expect(count).toBe(3);
  });
});
