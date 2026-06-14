import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Image, LucideAngularModule } from 'lucide-angular';

import { ImagePlaceholderComponent } from './image-placeholder.component';

describe('ImagePlaceholderComponent', () => {
  let fixture: ComponentFixture<ImagePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePlaceholderComponent, LucideAngularModule.pick({ Image })],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagePlaceholderComponent);
  });

  function box(): HTMLElement {
    return fixture.debugElement.query(By.css('[data-testid="image-placeholder"]')).nativeElement as HTMLElement;
  }

  it('renders a gray box with a centered Image icon and no fixed width', () => {
    fixture.detectChanges();

    expect(box().classList.contains('bg-image-placeholder-bg')).toBe(true);
    expect(box().classList.contains('w-full')).toBe(true);
    expect(fixture.debugElement.query(By.css('lucide-icon[name="Image"]'))).toBeTruthy();
  });

  it('defaults to a 16/9 aspect ratio when none is provided', () => {
    fixture.detectChanges();
    expect(box().style.aspectRatio).toBe('16/9');
  });

  it('applies a provided aspectRatio', () => {
    fixture.componentRef.setInput('aspectRatio', '4/3');
    fixture.detectChanges();
    expect(box().style.aspectRatio).toBe('4/3');
  });
});
