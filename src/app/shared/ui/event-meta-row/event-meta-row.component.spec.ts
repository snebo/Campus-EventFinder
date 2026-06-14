import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Calendar, Clock, LucideAngularModule, MapPin } from 'lucide-angular';

import { EventMetaRowComponent } from './event-meta-row.component';

describe('EventMetaRowComponent', () => {
  let fixture: ComponentFixture<EventMetaRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMetaRowComponent, LucideAngularModule.pick({ Calendar, Clock, MapPin })],
    }).compileComponents();

    fixture = TestBed.createComponent(EventMetaRowComponent);
  });

  function render(icon: string, text: string): void {
    fixture.componentRef.setInput('icon', icon);
    fixture.componentRef.setInput('text', text);
    fixture.detectChanges();
  }

  function iconName(): unknown {
    return fixture.debugElement.query(By.css('lucide-icon')).componentInstance.name;
  }

  it('renders the named icon followed by text in secondary color', () => {
    render('Clock', '10:00 AM - 2:00 PM');

    const wrapper = fixture.debugElement.query(By.css('div')).nativeElement as HTMLElement;
    expect(wrapper.classList.contains('text-text-secondary')).toBe(true);
    expect(iconName()).toBe('Clock');
    expect((fixture.debugElement.query(By.css('span')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      '10:00 AM - 2:00 PM',
    );
  });

  it('supports all three documented icon values', () => {
    for (const icon of ['Clock', 'MapPin', 'Calendar']) {
      render(icon, 'x');
      expect(iconName()).toBe(icon);
    }
  });

  it('truncates overly long text rather than breaking the row', () => {
    render('MapPin', 'A very long venue name that should not break the single-row layout at all');
    expect((fixture.debugElement.query(By.css('span')).nativeElement as HTMLElement).classList.contains('truncate')).toBe(
      true,
    );
  });
});
