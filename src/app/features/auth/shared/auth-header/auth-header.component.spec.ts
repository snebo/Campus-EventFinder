import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GraduationCap, Info, LucideAngularModule, X } from 'lucide-angular';

import { AuthHeaderComponent } from './auth-header.component';

@Component({
  selector: 'app-auth-header-host',
  imports: [AuthHeaderComponent],
  template: `
    <app-auth-header
      [brandName]="brandName()"
      [showInfo]="showInfo()"
      [infoTooltipText]="infoTooltipText()"
    />
  `,
})
class AuthHeaderHostComponent {
  brandName = signal('Eventfindr');
  showInfo = signal(true);
  infoTooltipText = signal('Eventfindr helps you discover campus events.');
}

describe('AuthHeaderComponent', () => {
  let fixture: ComponentFixture<AuthHeaderHostComponent>;
  let host: AuthHeaderHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHeaderHostComponent, LucideAngularModule.pick({ GraduationCap, Info, X })],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthHeaderHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function infoButton() {
    return fixture.debugElement.query(By.css('button[aria-label="About Eventfindr"]'));
  }

  function tooltipBody() {
    return fixture.debugElement.query(By.css('[data-testid="tooltip-body"]'));
  }

  it('always renders the LogoComponent with the given brandName', () => {
    expect(fixture.nativeElement.textContent.trim()).toContain('Eventfindr');
  });

  it('renders an info IconButtonComponent when showInfo=true (default)', () => {
    expect(infoButton()).toBeTruthy();
  });

  it('toggles the info tooltip when the info button is clicked', () => {
    expect(tooltipBody()).toBeNull();

    infoButton().nativeElement.click();
    fixture.detectChanges();

    expect(tooltipBody()).toBeTruthy();
    expect(tooltipBody().nativeElement.textContent.trim()).toBe('Eventfindr helps you discover campus events.');

    infoButton().nativeElement.click();
    fixture.detectChanges();

    expect(tooltipBody()).toBeNull();
  });

  it('hides the tooltip again when the tooltip emits dismiss', () => {
    infoButton().nativeElement.click();
    fixture.detectChanges();
    expect(tooltipBody()).toBeTruthy();

    const closeButton = fixture.debugElement.query(By.css('button[aria-label="Dismiss"]'));
    closeButton.nativeElement.click();
    fixture.detectChanges();

    expect(tooltipBody()).toBeNull();
  });

  it('renders no info icon and no tooltip when showInfo=false', () => {
    host.showInfo.set(false);
    fixture.detectChanges();

    expect(infoButton()).toBeNull();
    expect(tooltipBody()).toBeNull();
  });
});
