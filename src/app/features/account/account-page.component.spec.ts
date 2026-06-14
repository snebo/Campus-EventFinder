import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';

import { AuthService } from '../auth/data-access/auth.service';
import { AccountPageComponent } from './account-page.component';

const SESSION = {
  user: { id: 'user-1', fullName: 'Ada Eze', email: 'ada.eze@unilag.edu.ng' },
  token: 'mock-token-user-1',
};

describe('AccountPageComponent', () => {
  let fixture: ComponentFixture<AccountPageComponent>;
  let authService: { getSession: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [AccountPageComponent, LucideAngularModule.pick({ LoaderCircle })],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPageComponent);
    fixture.detectChanges();
  }

  beforeEach(() => {
    authService = { getSession: vi.fn().mockReturnValue(SESSION), logout: vi.fn() };
    router = { navigate: vi.fn().mockResolvedValue(true) };
  });

  it('renders the page header and the current user fullName and email', async () => {
    await setup();

    expect(fixture.debugElement.query(By.css('app-page-header'))).toBeTruthy();
    expect(
      (fixture.debugElement.query(By.css('[data-testid="account-full-name"]')).nativeElement as HTMLElement).textContent?.trim(),
    ).toBe('Ada Eze');
    expect(
      (fixture.debugElement.query(By.css('[data-testid="account-email"]')).nativeElement as HTMLElement).textContent?.trim(),
    ).toBe('ada.eze@unilag.edu.ng');
  });

  it('logs out and navigates to /login when Sign Out is clicked', async () => {
    await setup();

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('renders a graceful fallback without throwing when there is no session', async () => {
    authService.getSession.mockReturnValue(null);
    await setup();

    expect(fixture.debugElement.query(By.css('[data-testid="account-no-session"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('[data-testid="account-full-name"]'))).toBeNull();
  });
});
