import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { NavLinkItemComponent } from './nav-link-item.component';

@Component({
  selector: 'app-nav-link-item-host',
  imports: [NavLinkItemComponent],
  template: `<app-nav-link-item [label]="label()" [routerLink]="link()" [active]="active()" />`,
})
class NavLinkItemHostComponent {
  label = signal('Home');
  link = signal('/home');
  active = signal(false);
}

describe('NavLinkItemComponent', () => {
  let fixture: ComponentFixture<NavLinkItemHostComponent>;
  let host: NavLinkItemHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavLinkItemHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavLinkItemHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function anchor() {
    return fixture.debugElement.query(By.css('a'));
  }

  it('renders an anchor with the label, routerLink href, and a bottom border', () => {
    const a = anchor();
    expect(a.nativeElement.textContent.trim()).toBe('Home');
    expect(a.attributes['href']).toBe('/home');
    expect(a.nativeElement.classList.contains('border-b')).toBe(true);
  });

  it('renders secondary styling when inactive (default)', () => {
    expect(anchor().nativeElement.classList.contains('text-text-secondary')).toBe(true);
    expect(anchor().nativeElement.classList.contains('font-semibold')).toBe(false);
  });

  it('renders bold/primary styling when active', () => {
    host.active.set(true);
    fixture.detectChanges();
    expect(anchor().nativeElement.classList.contains('text-text-primary')).toBe(true);
    expect(anchor().nativeElement.classList.contains('font-semibold')).toBe(true);
  });
});
