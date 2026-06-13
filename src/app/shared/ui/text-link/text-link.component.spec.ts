import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ArrowRight, LucideAngularComponent, LucideAngularModule, X } from 'lucide-angular';

import { TextLinkComponent, TextLinkIconPosition, TextLinkWeight } from './text-link.component';

@Component({ selector: 'app-dummy-page', template: '' })
class DummyPageComponent {}

@Component({
  selector: 'app-text-link-host',
  imports: [TextLinkComponent],
  template: `
    <app-text-link
      [label]="label()"
      [routerLink]="routerLink()"
      [weight]="weight()"
      [comingSoon]="comingSoon()"
      [comingSoonText]="comingSoonText()"
      [icon]="icon()"
      [iconPosition]="iconPosition()"
      (clicked)="clickCount = clickCount + 1"
    />
  `,
})
class TextLinkHostComponent {
  label = signal('Forgot Password?');
  routerLink = signal<string | string[] | undefined>(undefined);
  weight = signal<TextLinkWeight>('regular');
  comingSoon = signal(false);
  comingSoonText = signal('Coming soon');
  icon = signal<string | undefined>(undefined);
  iconPosition = signal<TextLinkIconPosition>('left');
  clickCount = 0;
}

describe('TextLinkComponent', () => {
  let fixture: ComponentFixture<TextLinkHostComponent>;
  let host: TextLinkHostComponent;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextLinkHostComponent, LucideAngularModule.pick({ ArrowRight, X })],
      providers: [
        provideRouter([{ path: 'events/:id', component: DummyPageComponent }]),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextLinkHostComponent);
    host = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  function linkEl(): HTMLAnchorElement {
    return fixture.debugElement.query(By.css('a')).nativeElement as HTMLAnchorElement;
  }

  function tooltipBody() {
    return fixture.debugElement.query(By.css('[data-testid="tooltip-body"]'));
  }

  it('renders the label text inside an anchor', () => {
    expect(linkEl().textContent?.trim()).toBe('Forgot Password?');
  });

  it('navigates on click when routerLink is set, even when comingSoon=true', async () => {
    host.routerLink.set(['/events', '1']);
    host.comingSoon.set(true);
    fixture.detectChanges();

    linkEl().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(location.path()).toBe('/events/1');
    expect(host.clickCount).toBe(0);
    expect(tooltipBody()).toBeNull();
  });

  it('toggles the coming-soon tooltip without navigating or emitting clicked when comingSoon=true and routerLink is unset', () => {
    host.comingSoon.set(true);
    host.comingSoonText.set('Coming soon to Eventfindr');
    fixture.detectChanges();

    linkEl().click();
    fixture.detectChanges();

    expect(tooltipBody()).toBeTruthy();
    expect(tooltipBody().nativeElement.textContent.trim()).toBe('Coming soon to Eventfindr');
    expect(host.clickCount).toBe(0);

    linkEl().click();
    fixture.detectChanges();

    expect(tooltipBody()).toBeNull();
  });

  it('emits clicked exactly once when routerLink is unset and comingSoon=false', () => {
    fixture.detectChanges();

    linkEl().click();

    expect(host.clickCount).toBe(1);
    expect(tooltipBody()).toBeNull();
  });

  it('renders the icon before the label when iconPosition="left" (default)', () => {
    host.icon.set('ArrowRight');
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(LucideAngularComponent));

    expect(icon).toBeTruthy();
    expect(linkEl().firstElementChild?.tagName.toLowerCase()).toBe('lucide-icon');
  });

  it('renders the icon after the label when iconPosition="right"', () => {
    host.icon.set('ArrowRight');
    host.iconPosition.set('right');
    fixture.detectChanges();

    expect(linkEl().lastElementChild?.tagName.toLowerCase()).toBe('lucide-icon');
  });

  it('applies a bold font class when weight="bold"', () => {
    host.weight.set('bold');
    fixture.detectChanges();

    expect(linkEl().classList.contains('font-semibold')).toBe(true);
  });

  it('does not apply a bold font class when weight="regular" (default)', () => {
    fixture.detectChanges();

    expect(linkEl().classList.contains('font-semibold')).toBe(false);
  });
});
