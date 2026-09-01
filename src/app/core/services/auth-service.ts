import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth';
import { Observable, tap } from 'rxjs';
import { LOGIN_URL } from '../api';

const STORAGE_KEY = 'erp_user'

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<LoginResponse | null>(readStoredUser());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(LOGIN_URL, credentials)
      .pipe(
        tap((res) => {
          this.user.set(res);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
        }),
      );
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

}

function readStoredUser(): LoginResponse | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
