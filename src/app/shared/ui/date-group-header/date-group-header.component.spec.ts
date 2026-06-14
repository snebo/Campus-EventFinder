import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DateGroupHeaderComponent } from './date-group-header.component';

describe('DateGroupHeaderComponent', () => {
  let fixture: ComponentFixture<DateGroupHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateGroupHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateGroupHeaderComponent);
  });

  function heading(): HTMLElement {
    return fixture.debugElement.query(By.css('h3')).nativeElement as HTMLElement;
  }

  it('renders the label with a bottom-border divider beneath it', () => {
    fixture.componentRef.setInput('label', 'OCT 24');
    fixture.detectChanges();

    expect(heading().textContent?.trim()).toBe('OCT 24');
    expect(heading().classList.contains('border-b')).toBe(true);
    expect(heading().classList.contains('uppercase')).toBe(true);
  });

  it('renders a longer label without layout assumptions', () => {
    fixture.componentRef.setInput('label', 'NOVEMBER 15, 2026');
    fixture.detectChanges();

    expect(heading().textContent?.trim()).toBe('NOVEMBER 15, 2026');
  });
});
