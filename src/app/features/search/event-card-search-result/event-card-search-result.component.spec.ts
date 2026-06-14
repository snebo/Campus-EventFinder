import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bookmark, BookmarkCheck, Calendar, LoaderCircle, LucideAngularModule, MapPin } from 'lucide-angular';

import { EventSummary } from '../../../shared/models/event.model';
import { EventCardSearchResultComponent } from './event-card-search-result.component';

const EVENT: EventSummary = {
  id: 'evt-01',
  title: 'Annual Tech Symposium',
  category: 'academic',
  imageUrl: 'https://example.com/evt-01.jpg',
  dateLabel: 'NOV 15',
  timeLabel: '10:00 AM - 2:00 PM',
  location: 'Faculty of Science Auditorium',
  isBookmarked: false,
};

describe('EventCardSearchResultComponent', () => {
  let fixture: ComponentFixture<EventCardSearchResultComponent>;
  let component: EventCardSearchResultComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventCardSearchResultComponent,
        LucideAngularModule.pick({ Bookmark, BookmarkCheck, Calendar, LoaderCircle, MapPin }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardSearchResultComponent);
    component = fixture.componentInstance;
  });

  function render(event: EventSummary = EVENT): void {
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
  }

  function buttonByLabel(label: string): HTMLElement {
    return fixture.debugElement
      .queryAll(By.css('app-button button'))
      .find((b) => (b.nativeElement as HTMLElement).textContent?.trim().includes(label))!.nativeElement as HTMLElement;
  }

  it('renders the image with bookmark (top-left) and category badge (top-right)', () => {
    render();
    expect((fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement).getAttribute('src')).toBe(
      'https://example.com/evt-01.jpg',
    );
    expect(fixture.debugElement.query(By.css('app-bookmark-button'))).toBeTruthy();
    expect((fixture.debugElement.query(By.css('app-event-badge')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'ACADEMIC',
    );
  });

  it('combines dateLabel and timeLabel into a Calendar meta row', () => {
    render();
    const rows = fixture.debugElement.queryAll(By.css('app-event-meta-row'));
    expect(rows[0].query(By.css('lucide-icon')).componentInstance.name).toBe('Calendar');
    expect((rows[0].nativeElement as HTMLElement).textContent?.trim()).toBe('NOV 15 · 10:00 AM - 2:00 PM');
    expect(rows[1].query(By.css('lucide-icon')).componentInstance.name).toBe('MapPin');
  });

  it('bubbles the bookmark toggle as bookmarkToggle(id) without mutating the input', () => {
    render();
    let emitted: string | null = null;
    component.bookmarkToggle.subscribe((id) => (emitted = id));

    fixture.debugElement.query(By.css('app-bookmark-button')).componentInstance.toggle.emit();
    expect(emitted).toBe('evt-01');
    expect(component.event().isBookmarked).toBe(false);
  });

  it('emits registerClick and detailsClick with the event id', () => {
    render();
    let registered: string | null = null;
    let detailed: string | null = null;
    component.registerClick.subscribe((id) => (registered = id));
    component.detailsClick.subscribe((id) => (detailed = id));

    buttonByLabel('REGISTER').click();
    buttonByLabel('DETAILS').click();

    expect(registered).toBe('evt-01');
    expect(detailed).toBe('evt-01');
  });
});
