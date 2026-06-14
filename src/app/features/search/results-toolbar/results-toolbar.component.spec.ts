import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ResultsToolbarComponent } from './results-toolbar.component';

describe('ResultsToolbarComponent', () => {
  let fixture: ComponentFixture<ResultsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ResultsToolbarComponent] }).compileComponents();
    fixture = TestBed.createComponent(ResultsToolbarComponent);
  });

  function text(count: number): string {
    fixture.componentRef.setInput('resultCount', count);
    fixture.detectChanges();
    return (fixture.debugElement.query(By.css('[data-testid="results-toolbar-count"]')).nativeElement as HTMLElement).textContent!.trim();
  }

  it('pluralizes correctly for 0, 1, and many', () => {
    expect(text(0)).toBe('Showing 0 events');
    expect(text(1)).toBe('Showing 1 event');
    expect(text(24)).toBe('Showing 24 events');
  });
});
