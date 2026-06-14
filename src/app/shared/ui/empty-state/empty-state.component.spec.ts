import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;
  let component: EmptyStateComponent;
  let router: Router;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, LucideAngularModule.pick({ LoaderCircle })],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  function button() {
    return fixture.debugElement.query(By.css('app-button button'));
  }

  it('renders only the message when no ctaLabel is provided', () => {
    fixture.componentRef.setInput('message', 'Nothing here.');
    fixture.detectChanges();

    expect((fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'Nothing here.',
    );
    expect(button()).toBeNull();
  });

  it('navigates to ctaRouterLink on click when both ctaLabel and ctaRouterLink are set', () => {
    fixture.componentRef.setInput('message', "You haven't RSVP'd to any events yet.");
    fixture.componentRef.setInput('ctaLabel', 'Browse events');
    fixture.componentRef.setInput('ctaRouterLink', '/search');
    fixture.detectChanges();

    let emitted = 0;
    component.ctaClick.subscribe(() => (emitted += 1));

    button().nativeElement.click();
    expect(navigate).toHaveBeenCalledWith(['/search']);
    expect(emitted).toBe(0);
  });

  it('emits ctaClick (no navigation) when ctaLabel is set but ctaRouterLink is not', () => {
    fixture.componentRef.setInput('message', 'Nothing here.');
    fixture.componentRef.setInput('ctaLabel', 'Do something');
    fixture.detectChanges();

    let emitted = 0;
    component.ctaClick.subscribe(() => (emitted += 1));

    button().nativeElement.click();
    expect(emitted).toBe(1);
    expect(navigate).not.toHaveBeenCalled();
  });
});
