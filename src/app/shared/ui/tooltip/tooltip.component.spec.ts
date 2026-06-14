import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LucideAngularModule, X } from 'lucide-angular';

import { TooltipComponent, TooltipVariant } from './tooltip.component';

@Component({
  selector: 'app-tooltip-host',
  imports: [TooltipComponent],
  template: `
    <app-tooltip
      [visible]="visible"
      [text]="text"
      [variant]="variant"
      [showCloseButton]="showCloseButton"
      [autoDismissMs]="autoDismissMs"
      (dismiss)="dismissCount = dismissCount + 1"
    >
      @if (!text) {
        <span class="projected">Projected content</span>
      }
    </app-tooltip>
  `,
})
class TooltipHostComponent {
  visible = false;
  text: string | undefined;
  variant: TooltipVariant = 'info';
  showCloseButton = true;
  autoDismissMs: number | undefined = 5000;
  dismissCount = 0;
}

describe('TooltipComponent', () => {
  let fixture: ComponentFixture<TooltipHostComponent>;
  let host: TooltipHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHostComponent, LucideAngularModule.pick({ X })],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function tooltipBody() {
    return fixture.debugElement.query(By.css('[data-testid="tooltip-body"]'));
  }

  it('does not render the tooltip body when visible=false', () => {
    fixture.detectChanges();

    expect(tooltipBody()).toBeNull();
  });

  it('renders the text input when visible=true', () => {
    host.visible = true;
    host.text = 'Coming soon';
    fixture.detectChanges();

    expect(tooltipBody().nativeElement.textContent.trim()).toContain('Coming soon');
  });

  it('renders projected content when no text is provided', () => {
    host.visible = true;
    fixture.detectChanges();

    expect(tooltipBody().nativeElement.textContent).toContain('Projected content');
  });

  it('is fixed to the top-right of the viewport and clamped so it cannot overflow', () => {
    host.visible = true;
    host.text = 'A long tooltip message that would otherwise overflow a small mobile screen';
    fixture.detectChanges();

    const classList = tooltipBody().nativeElement.classList;
    expect(classList.contains('fixed')).toBe(true);
    expect(classList.contains('top-4')).toBe(true);
    expect(classList.contains('right-4')).toBe(true);
    expect(classList.contains('max-w-[min(20rem,calc(100vw_-_2rem))]')).toBe(true);
  });

  it('emits dismiss once when clicking outside the tooltip', () => {
    host.visible = true;
    host.text = 'Tip';
    fixture.detectChanges();

    document.body.click();

    expect(host.dismissCount).toBe(1);
  });

  it('does not emit dismiss when clicking inside the tooltip', () => {
    host.visible = true;
    host.text = 'Tip';
    fixture.detectChanges();

    tooltipBody().nativeElement.click();

    expect(host.dismissCount).toBe(0);
  });

  it('does not emit dismiss from outside clicks when visible=false', () => {
    fixture.detectChanges();

    document.body.click();

    expect(host.dismissCount).toBe(0);
  });

  it('renders a close button by default and emits dismiss when clicked', () => {
    host.visible = true;
    host.text = 'Tip';
    host.autoDismissMs = undefined;
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('button[aria-label="Dismiss"]'));
    expect(closeButton).toBeTruthy();

    closeButton.nativeElement.click();

    expect(host.dismissCount).toBe(1);
  });

  it('does not render a close button when showCloseButton=false', () => {
    host.visible = true;
    host.text = 'Tip';
    host.showCloseButton = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('button[aria-label="Dismiss"]'))).toBeNull();
  });

  it('auto-dismisses after autoDismissMs once visible becomes true', () => {
    vi.useFakeTimers();

    const directFixture = TestBed.createComponent(TooltipComponent);
    directFixture.componentRef.setInput('visible', false);
    directFixture.componentRef.setInput('text', 'Tip');
    directFixture.componentRef.setInput('autoDismissMs', 1000);
    directFixture.detectChanges();

    let dismissCount = 0;
    directFixture.componentInstance.dismiss.subscribe(() => dismissCount++);

    directFixture.componentRef.setInput('visible', true);
    directFixture.detectChanges();

    vi.advanceTimersByTime(1000);

    expect(dismissCount).toBe(1);
  });

  it('does not auto-dismiss when autoDismissMs is 0', () => {
    vi.useFakeTimers();

    const directFixture = TestBed.createComponent(TooltipComponent);
    directFixture.componentRef.setInput('visible', false);
    directFixture.componentRef.setInput('text', 'Tip');
    directFixture.componentRef.setInput('autoDismissMs', 0);
    directFixture.detectChanges();

    let dismissCount = 0;
    directFixture.componentInstance.dismiss.subscribe(() => dismissCount++);

    directFixture.componentRef.setInput('visible', true);
    directFixture.detectChanges();

    vi.advanceTimersByTime(10000);

    expect(dismissCount).toBe(0);
  });

  it('applies error variant classes for variant="error"', () => {
    host.visible = true;
    host.text = 'Error';
    host.variant = 'error';
    fixture.detectChanges();

    const classList = tooltipBody().nativeElement.classList;
    expect(classList.contains('bg-tooltip-error-bg')).toBe(true);
    expect(classList.contains('border-tooltip-error-border')).toBe(true);
    expect(classList.contains('text-tooltip-error-text')).toBe(true);
  });

  it('applies info/neutral variant classes by default', () => {
    host.visible = true;
    host.text = 'Info';
    fixture.detectChanges();

    const classList = tooltipBody().nativeElement.classList;
    expect(classList.contains('bg-tooltip-info-bg')).toBe(true);
    expect(classList.contains('text-tooltip-info-text')).toBe(true);
  });
});
