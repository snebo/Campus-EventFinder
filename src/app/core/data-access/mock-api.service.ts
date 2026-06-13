import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, delay, map, shareReplay } from 'rxjs';

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  token: string;
}

interface MockDb {
  users: MockUser[];
}

interface CreateUserValue {
  fullName: string;
  email: string;
  password: string;
}

const DB_URL = 'assets/mock/db.json';
const MOCK_DELAY_MS = 400;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * In-memory mock backend for auth endpoints, backed by `assets/mock/db.json`.
 * The fetched users are cached in memory for the lifetime of the app — this
 * is the seam where a real backend would later be swapped in. Anything added
 * via `createUser` is lost on a full page reload since it is never written
 * back to disk.
 */
@Injectable({ providedIn: 'root' })
export class MockApiService {
  private readonly users = signal<MockUser[]>([]);
  private rawLoad$: Observable<void> | null = null;

  constructor(private readonly http: HttpClient) {}

  load(): Observable<void> {
    return this.ensureLoaded().pipe(delay(MOCK_DELAY_MS));
  }

  findUserByEmail(email: string): Observable<MockUser | undefined> {
    return this.ensureLoaded().pipe(
      map(() => this.users().find((user) => user.email === email)),
      delay(MOCK_DELAY_MS),
    );
  }

  createUser(value: CreateUserValue): Observable<MockUser> {
    return this.ensureLoaded().pipe(
      map(() => {
        const user: MockUser = {
          id: generateId('user'),
          token: generateId('token'),
          ...value,
        };
        this.users.set([...this.users(), user]);
        return user;
      }),
      delay(MOCK_DELAY_MS),
    );
  }

  validateCredentials(email: string, password: string): Observable<MockUser | null> {
    return this.ensureLoaded().pipe(
      map(() => this.users().find((user) => user.email === email && user.password === password) ?? null),
      delay(MOCK_DELAY_MS),
    );
  }

  private ensureLoaded(): Observable<void> {
    if (!this.rawLoad$) {
      this.rawLoad$ = this.http.get<MockDb>(DB_URL).pipe(
        map((db) => {
          this.users.set(db.users);
        }),
        shareReplay(1),
      );
    }
    return this.rawLoad$;
  }
}
