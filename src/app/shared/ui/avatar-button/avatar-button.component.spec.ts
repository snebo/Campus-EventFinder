import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LucideAngularModule, User } from 'lucide-angular';

import { AvatarButtonComponent } from './avatar-button.component';

describe('AvatarButtonComponent', () => {
  let fixture: ComponentFixture<AvatarButtonComponent>;
  let component: AvatarButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarButtonComponent, LucideAngularModule.pick({ User })],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarButtonComponent);
    component = fixture.componentInstance;
  });

  it('renders a circular img when imageUrl is provided', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect((img.nativeElement as HTMLImageElement).getAttribute('src')).toBe('https://example.com/a.png');
    expect(img.nativeElement.classList.contains('rounded-full')).toBe(true);
    expect(fixture.debugElement.query(By.css('app-icon-button'))).toBeNull();
  });

  it('renders the User icon-button fallback (variant=default) when imageUrl is absent', () => {
    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(By.css('app-icon-button'));
    expect(iconButton).toBeTruthy();
    expect((iconButton.query(By.css('button')).nativeElement as HTMLElement).classList.contains('rounded-full')).toBe(
      true,
    );
    expect(fixture.debugElement.query(By.css('img'))).toBeNull();
  });

  it('emits clicked exactly once when clicked (fallback)', () => {
    fixture.detectChanges();
    let count = 0;
    component.clicked.subscribe(() => (count += 1));

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(count).toBe(1);
  });

  it('emits clicked exactly once when clicked (image)', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/a.png');
    fixture.detectChanges();
    let count = 0;
    component.clicked.subscribe(() => (count += 1));

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(count).toBe(1);
  });

  it("defaults ariaLabel to 'Account' and allows overriding", () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button')).attributes['aria-label']).toBe('Account');

    fixture.componentRef.setInput('ariaLabel', 'Profile');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button')).attributes['aria-label']).toBe('Profile');
  });
});
