import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChevronRight, LucideAngularModule } from 'lucide-angular';

import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  let fixture: ComponentFixture<SectionHeaderComponent>;
  let component: SectionHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderComponent, LucideAngularModule.pick({ ChevronRight })],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionHeaderComponent);
    component = fixture.componentInstance;
  });

  function action() {
    return fixture.debugElement.query(By.css('[data-testid="section-header-action"]'));
  }

  it('renders only the title when no action is provided', () => {
    fixture.componentRef.setInput('title', 'Upcoming in Unilag');
    fixture.detectChanges();

    expect((fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'Upcoming in Unilag',
    );
    expect(action()).toBeNull();
  });

  it('renders actionLabel as a clickable trailing action and emits actionClick', () => {
    fixture.componentRef.setInput('title', 'Upcoming');
    fixture.componentRef.setInput('actionLabel', 'SEE ALL');
    fixture.detectChanges();

    expect((action().nativeElement as HTMLElement).textContent?.trim()).toBe('SEE ALL');

    let count = 0;
    component.actionClick.subscribe(() => (count += 1));
    action().nativeElement.click();
    expect(count).toBe(1);
  });

  it('renders actionIcon when actionLabel is absent and emits actionClick', () => {
    fixture.componentRef.setInput('title', 'Trending');
    fixture.componentRef.setInput('actionIcon', 'ChevronRight');
    fixture.detectChanges();

    expect(action().query(By.css('lucide-icon')).componentInstance.name).toBe('ChevronRight');

    let count = 0;
    component.actionClick.subscribe(() => (count += 1));
    action().nativeElement.click();
    expect(count).toBe(1);
  });

  it('prefers actionLabel over actionIcon when both are provided', () => {
    fixture.componentRef.setInput('title', 'Trending');
    fixture.componentRef.setInput('actionLabel', 'SEE ALL');
    fixture.componentRef.setInput('actionIcon', 'ChevronRight');
    fixture.detectChanges();

    expect((action().nativeElement as HTMLElement).textContent?.trim()).toBe('SEE ALL');
    expect(fixture.debugElement.query(By.css('lucide-icon'))).toBeNull();
  });
});
