import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MockApiService, MockUser } from './mock-api.service';

const DB_URL = 'assets/mock/db.json';

const MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    fullName: 'Ada Eze',
    email: 'ada.eze@unilag.edu.ng',
    password: 'Password123',
    token: 'mock-token-user-1',
  },
  {
    id: 'user-2',
    fullName: 'Tunde Bakare',
    email: 'tunde.bakare@unilag.edu.ng',
    password: 'Password123',
    token: 'mock-token-user-2',
  },
];

describe('MockApiService', () => {
  let service: MockApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MockApiService);
    httpMock = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  function flushDb(): void {
    httpMock.expectOne(DB_URL).flush({ users: structuredClone(MOCK_USERS) });
  }

  it('load() fetches db.json once and caches it; a second call does not re-fetch', async () => {
    const first = firstValueFrom(service.load());
    flushDb();
    await vi.advanceTimersByTimeAsync(500);
    await expect(first).resolves.toBeUndefined();

    const second = firstValueFrom(service.load());
    await vi.advanceTimersByTimeAsync(500);
    await expect(second).resolves.toBeUndefined();

    httpMock.expectNone(DB_URL);
  });

  it('findUserByEmail() returns the matching cached user on a case-sensitive exact match', async () => {
    const found = firstValueFrom(service.findUserByEmail('ada.eze@unilag.edu.ng'));
    flushDb();
    await vi.advanceTimersByTimeAsync(500);

    await expect(found).resolves.toEqual(MOCK_USERS[0]);
  });

  it('findUserByEmail() returns undefined when no user matches (case-sensitive)', async () => {
    const found = firstValueFrom(service.findUserByEmail('Ada.Eze@unilag.edu.ng'));
    flushDb();
    await vi.advanceTimersByTimeAsync(500);

    await expect(found).resolves.toBeUndefined();
  });

  it('createUser() appends a new in-memory user with a generated id/token, findable afterwards', async () => {
    const created = firstValueFrom(
      service.createUser({ fullName: 'New Student', email: 'new.student@unilag.edu.ng', password: 'Password123' }),
    );
    flushDb();
    await vi.advanceTimersByTimeAsync(500);

    const newUser = await created;
    expect(newUser.id).toBeTruthy();
    expect(newUser.token).toBeTruthy();
    expect(newUser.fullName).toBe('New Student');
    expect(newUser.email).toBe('new.student@unilag.edu.ng');

    const found = firstValueFrom(service.findUserByEmail('new.student@unilag.edu.ng'));
    await vi.advanceTimersByTimeAsync(500);

    await expect(found).resolves.toEqual(newUser);
  });

  it('validateCredentials() returns the matching user when email+password match', async () => {
    const result = firstValueFrom(service.validateCredentials('ada.eze@unilag.edu.ng', 'Password123'));
    flushDb();
    await vi.advanceTimersByTimeAsync(500);

    await expect(result).resolves.toEqual(MOCK_USERS[0]);
  });

  it('validateCredentials() returns null when the password does not match', async () => {
    const result = firstValueFrom(service.validateCredentials('ada.eze@unilag.edu.ng', 'wrong-password'));
    flushDb();
    await vi.advanceTimersByTimeAsync(500);

    await expect(result).resolves.toBeNull();
  });

  it('validateCredentials() returns null when no user matches the email', async () => {
    const result = firstValueFrom(service.validateCredentials('unknown@unilag.edu.ng', 'Password123'));
    flushDb();
    await vi.advanceTimersByTimeAsync(500);

    await expect(result).resolves.toBeNull();
  });

  it('emits after a ~300-500ms simulated delay rather than immediately', async () => {
    let resolved = false;
    const promise = firstValueFrom(service.load()).then(() => {
      resolved = true;
    });
    flushDb();

    await vi.advanceTimersByTimeAsync(100);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(400);
    expect(resolved).toBe(true);

    await promise;
  });
});
