import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PageHeaderComponent } from './page-header.component';

@Component({
  selector: 'app-page-header-host',
  imports: [PageHeaderComponent],
  template: `
    <app-page-header
      [title]="title()"
      [subtitle]="subtitle()"
      [greetingName]="greetingName()"
      [emoji]="emoji()"
    />
  `,
})
class PageHeaderHostComponent {
  title = signal('My Schedule');
  subtitle = signal('Manage your upcoming campus activities.');
  greetingName = signal<string | undefined>(undefined);
  emoji = signal<string | undefined>(undefined);
}

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderHostComponent>;
  let host: PageHeaderHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function headingEl(): HTMLElement {
    return fixture.debugElement.query(By.css('h1')).nativeElement as HTMLElement;
  }

  function subtitleEl(): HTMLElement {
    return fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement;
  }

  it('renders title as the heading when greetingName is not provided', () => {
    expect(headingEl().textContent?.trim()).toBe('My Schedule');
  });

  it('renders the subtitle below the heading', () => {
    expect(subtitleEl().textContent?.trim()).toBe('Manage your upcoming campus activities.');
  });

  it('renders "Hey {{greetingName}}! {{emoji}}" and ignores title when greetingName and emoji are provided', () => {
    host.greetingName.set('Ada');
    host.emoji.set('👋');
    fixture.detectChanges();

    expect(headingEl().textContent?.trim()).toBe('Hey Ada! 👋');
  });

  it('omits the emoji segment when greetingName is provided without emoji', () => {
    host.greetingName.set('Ada');
    fixture.detectChanges();

    expect(headingEl().textContent?.trim()).toBe('Hey Ada!');
  });

  it('still renders the subtitle in greeting mode', () => {
    host.greetingName.set('Ada');
    host.emoji.set('👋');
    host.subtitle.set("Here's what's happening on campus!");
    fixture.detectChanges();

    expect(subtitleEl().textContent?.trim()).toBe("Here's what's happening on campus!");
  });

  it('uses the heading-1 font token for the heading', () => {
    expect(headingEl().classList.contains('text-heading-1')).toBe(true);
  });

  it('uses the subtitle font token for the subtitle', () => {
    expect(subtitleEl().classList.contains('text-subtitle')).toBe(true);
  });
});
