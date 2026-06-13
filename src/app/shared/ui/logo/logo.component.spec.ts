import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GraduationCap, LucideAngularComponent, LucideAngularModule } from 'lucide-angular';

import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent, LucideAngularModule.pick({ GraduationCap })],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the GraduationCap icon followed by the Eventfindr wordmark', () => {
    const icon = fixture.debugElement.query(By.directive(LucideAngularComponent));

    expect(icon.componentInstance.name).toBe('GraduationCap');
    expect(fixture.nativeElement.textContent.trim()).toBe('Eventfindr');
  });

  it('defaults to size "md" and renders the wordmark with the logo font-size token', () => {
    expect(component.size()).toBe('md');

    const text = fixture.debugElement.query(By.css('span span'));
    expect(text.nativeElement.classList.contains('text-logo')).toBe(true);
  });

  it('renders a smaller icon and text for size="sm"', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(LucideAngularComponent));
    const text = fixture.debugElement.query(By.css('span span'));

    expect(icon.componentInstance.size).toBeLessThan(20);
    expect(text.nativeElement.classList.contains('text-logo')).toBe(false);
  });

  it('renders a larger icon and text for size="lg"', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.directive(LucideAngularComponent));
    const text = fixture.debugElement.query(By.css('span span'));

    expect(icon.componentInstance.size).toBeGreaterThan(20);
    expect(text.nativeElement.classList.contains('text-logo')).toBe(false);
  });
});
