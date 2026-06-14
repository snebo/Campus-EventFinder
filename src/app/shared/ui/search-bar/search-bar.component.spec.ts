import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LucideAngularModule, Search, SlidersHorizontal } from 'lucide-angular';

import { SearchBarComponent } from './search-bar.component';

@Component({
  selector: 'app-search-bar-host',
  imports: [SearchBarComponent],
  template: `
    <app-search-bar
      [placeholder]="placeholder()"
      [showFilterButton]="showFilterButton()"
      [value]="value()"
      (valueChange)="lastValue = $event; valueChangeCount = valueChangeCount + 1"
      (submit)="submitted = $event"
      (filterClick)="filterCount = filterCount + 1"
    />
  `,
})
class SearchBarHostComponent {
  placeholder = signal('Search events');
  showFilterButton = signal(false);
  value = signal('');
  lastValue: string | null = null;
  valueChangeCount = 0;
  submitted: string | null = null;
  filterCount = 0;
}

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarHostComponent>;
  let host: SearchBarHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarHostComponent, LucideAngularModule.pick({ Search, SlidersHorizontal })],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function input(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
  }

  function setValue(value: string): void {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('renders an input with the placeholder and a leading Search icon', () => {
    expect(input().getAttribute('placeholder')).toBe('Search events');
    expect(fixture.debugElement.query(By.css('lucide-icon'))).toBeTruthy();
  });

  it('reflects the value input as the displayed value', () => {
    host.value.set('concerts');
    fixture.detectChanges();
    expect(input().value).toBe('concerts');
  });

  it('emits valueChange on every keystroke with the current value', () => {
    setValue('a');
    setValue('ab');
    expect(host.valueChangeCount).toBe(2);
    expect(host.lastValue).toBe('ab');
  });

  it('emits submit with the current value when Enter is pressed', () => {
    setValue('music');
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(host.submitted).toBe('music');
  });

  it('renders no filter button by default and emits filterClick when one is shown and clicked', () => {
    expect(fixture.debugElement.query(By.css('app-icon-button'))).toBeNull();

    host.showFilterButton.set(true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('app-icon-button button'));
    expect(button).toBeTruthy();
    button.nativeElement.click();
    expect(host.filterCount).toBe(1);
  });
});
