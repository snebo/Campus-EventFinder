import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Clock, Image, LoaderCircle, LucideAngularModule, MapPin } from 'lucide-angular';

import { EventSummary } from '../../../shared/models/event.model';
import { EventCardFeaturedComponent } from './event-card-featured.component';

const BASE_EVENT: EventSummary = {
  id: 'evt-01',
  title: 'Annual Tech Symposium',
  imageUrl: 'https://example.com/evt-01.jpg',
  dateLabel: 'NOV 15',
  timeLabel: '10:00 AM - 2:00 PM',
  location: 'Faculty of Science Auditorium',
};

describe('EventCardFeaturedComponent', () => {
  let fixture: ComponentFixture<EventCardFeaturedComponent>;
  let component: EventCardFeaturedComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardFeaturedComponent, LucideAngularModule.pick({ Clock, Image, LoaderCircle, MapPin })],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardFeaturedComponent);
    component = fixture.componentInstance;
  });

  function render(event: EventSummary): void {
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
  }

  function metaRows() {
    return fixture.debugElement.queryAll(By.css('app-event-meta-row'));
  }

  it('renders an img when imageUrl is set, with the date badge overlaid', () => {
    render(BASE_EVENT);

    const img = fixture.debugElement.query(By.css('img'));
    expect((img.nativeElement as HTMLImageElement).getAttribute('src')).toBe('https://example.com/evt-01.jpg');
    expect(fixture.debugElement.query(By.css('app-image-placeholder'))).toBeNull();
    expect((fixture.debugElement.query(By.css('app-event-badge')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'NOV 15',
    );
  });

  it('renders the placeholder when imageUrl is absent', () => {
    render({ ...BASE_EVENT, imageUrl: undefined });
    expect(fixture.debugElement.query(By.css('img'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-image-placeholder'))).toBeTruthy();
  });

  it('renders title and the Clock + MapPin meta rows', () => {
    render(BASE_EVENT);
    expect((fixture.debugElement.query(By.css('h3')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'Annual Tech Symposium',
    );
    expect(metaRows().length).toBe(2);
    expect(metaRows()[0].query(By.css('lucide-icon')).componentInstance.name).toBe('Clock');
    expect(metaRows()[1].query(By.css('lucide-icon')).componentInstance.name).toBe('MapPin');
  });

  it('omits a meta row when its field is undefined', () => {
    render({ ...BASE_EVENT, timeLabel: undefined });
    expect(metaRows().length).toBe(1);
    expect(metaRows()[0].query(By.css('lucide-icon')).componentInstance.name).toBe('MapPin');
  });

  it('emits learnMoreClick with the event id when LEARN MORE is clicked', () => {
    render(BASE_EVENT);
    let emitted: string | null = null;
    component.learnMoreClick.subscribe((id) => (emitted = id));

    (fixture.debugElement.query(By.css('button')).nativeElement as HTMLElement).click();
    expect(emitted).toBe('evt-01');
  });
});
