import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MockApiService, MockUser } from '../../../core/data-access/mock-api.service';
import { AuthError, AuthSession } from './auth.models';
import { AuthService } from './auth.service';

const SESSION_KEY = 'eventfindr.session';

/**
 * Node 22+ defines a global `localStorage` stub (active without
 * `--localstorage-file`) that shadows jsdom's working implementation here
 * since `window === globalThis` in this test environment. Replace it with a
 * simple in-memory Storage for these tests.
 */
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } as Storage;
}

const VALID_USER: MockUser = {
  id: 'user-1',
  fullName: 'Ada Eze',
  email: 'ada.eze@unilag.edu.ng',
  password: 'Password123',
  token: 'mock-token-user-1',
};

describe('AuthService', () => {
  let service: AuthService;
  let mockApi: {
    validateCredentials: ReturnType<typeof vi.fn>;
    findUserByEmail: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMemoryStorage(),
      configurable: true,
    });

    mockApi = {
      validateCredentials: vi.fn(),
      findUserByEmail: vi.fn(),
      createUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: MockApiService, useValue: mockApi }],
    });

    service = TestBed.inject(AuthService);
  });

  describe('login', () => {
    it('resolves with an AuthSession and persists it to localStorage on valid credentials', async () => {
      mockApi.validateCredentials.mockReturnValue(of(VALID_USER));

      const session = await service.login({ email: VALID_USER.email, password: VALID_USER.password });

      expect(mockApi.validateCredentials).toHaveBeenCalledWith(VALID_USER.email, VALID_USER.password);
      expect(session).toEqual<AuthSession>({
        user: { id: VALID_USER.id, fullName: VALID_USER.fullName, email: VALID_USER.email },
        token: VALID_USER.token,
      });
      expect(JSON.parse(window.localStorage.getItem(SESSION_KEY)!)).toEqual(session);
    });

    it('rejects with "Invalid email or password..." (no fieldErrors) when credentials do not match', async () => {
      mockApi.validateCredentials.mockReturnValue(of(null));

      const expectedError: AuthError = { message: 'Invalid email or password. Please try again.' };
      await expect(service.login({ email: 'nobody@unilag.edu.ng', password: 'wrong' })).rejects.toEqual(
        expectedError,
      );
      expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
    });
  });

  describe('signup', () => {
    const newUser: MockUser = {
      id: 'user-new',
      fullName: 'New Student',
      email: 'new.student@unilag.edu.ng',
      password: 'Password123',
      token: 'mock-token-new',
    };

    it('resolves with a new AuthSession and creates the user when the email is new', async () => {
      mockApi.findUserByEmail.mockReturnValue(of(undefined));
      mockApi.createUser.mockReturnValue(of(newUser));

      const session = await service.signup({
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
      });

      expect(mockApi.findUserByEmail).toHaveBeenCalledWith(newUser.email);
      expect(mockApi.createUser).toHaveBeenCalledWith({
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
      });
      expect(session).toEqual<AuthSession>({
        user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email },
        token: newUser.token,
      });
      expect(JSON.parse(window.localStorage.getItem(SESSION_KEY)!)).toEqual(session);
    });

    it('rejects with "Email already in use" + fieldErrors.email when the email already exists', async () => {
      mockApi.findUserByEmail.mockReturnValue(of(VALID_USER));

      const expectedError: AuthError = {
        message: 'Email already in use',
        fieldErrors: { email: 'Email already in use' },
      };
      await expect(
        service.signup({ fullName: 'Someone Else', email: VALID_USER.email, password: 'Password123' }),
      ).rejects.toEqual(expectedError);
      expect(mockApi.createUser).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
    });
  });

  describe('session persistence', () => {
    it('getSession() returns null when nothing is stored', () => {
      expect(service.getSession()).toBeNull();
    });

    it('getSession() returns the stored session, including after a simulated page reload', async () => {
      mockApi.validateCredentials.mockReturnValue(of(VALID_USER));
      const session = await service.login({ email: VALID_USER.email, password: VALID_USER.password });

      expect(service.getSession()).toEqual(session);

      // Simulate a full page reload: fresh injector/instance, same localStorage.
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: MockApiService, useValue: mockApi }],
      });
      const reloaded = TestBed.inject(AuthService);

      expect(reloaded).not.toBe(service);
      expect(reloaded.getSession()).toEqual(session);
    });
  });

  describe('logout', () => {
    it('clears the stored session so getSession() returns null afterwards', async () => {
      mockApi.validateCredentials.mockReturnValue(of(VALID_USER));
      await service.login({ email: VALID_USER.email, password: VALID_USER.password });

      service.logout();

      expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
      expect(service.getSession()).toBeNull();
    });
  });
});
