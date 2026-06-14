import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bookmark, BookmarkCheck, LucideAngularModule } from 'lucide-angular';

import { BookmarkButtonComponent } from './bookmark-button.component';

describe('BookmarkButtonComponent', () => {
  let fixture: ComponentFixture<BookmarkButtonComponent>;
  let component: BookmarkButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarkButtonComponent, LucideAngularModule.pick({ Bookmark, BookmarkCheck })],
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkButtonComponent);
    component = fixture.componentInstance;
  });

  function render(saved: boolean): void {
    fixture.componentRef.setInput('saved', saved);
    fixture.detectChanges();
  }

  function button(): HTMLElement {
    return fixture.debugElement.query(By.css('button')).nativeElement as HTMLElement;
  }

  it('renders a circular overlay button', () => {
    render(false);
    expect(button().classList.contains('rounded-full')).toBe(true);
  });

  function iconName(): unknown {
    return fixture.debugElement.query(By.css('lucide-icon')).componentInstance.name;
  }

  it('renders the outline Bookmark icon when saved=false', () => {
    render(false);
    expect(iconName()).toBe('Bookmark');
  });

  it('renders the filled BookmarkCheck icon when saved=true', () => {
    render(true);
    expect(iconName()).toBe('BookmarkCheck');
  });

  it('emits toggle exactly once per click without flipping its own rendering', () => {
    render(false);
    let count = 0;
    component.toggle.subscribe(() => (count += 1));

    button().click();
    fixture.detectChanges();

    expect(count).toBe(1);
    // Still shows the outline icon — parent owns state.
    expect(iconName()).toBe('Bookmark');
  });
});
