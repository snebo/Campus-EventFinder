import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '../../features/auth/data-access/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: { getSession: ReturnType<typeof vi.fn> };
  const loginTree = {} as UrlTree;
  const router = { createUrlTree: vi.fn().mockReturnValue(loginTree) };

  function run() {
    return TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
  }

  beforeEach(() => {
    authService = { getSession: vi.fn() };
    router.createUrlTree.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows activation when a session exists', () => {
    authService.getSession.mockReturnValue({ user: {}, token: 't' });
    expect(run()).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to /login when no session exists', () => {
    authService.getSession.mockReturnValue(null);
    expect(run()).toBe(loginTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
