import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserModel } from '../models';
import { environment } from '../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  user: UserModel;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, request);
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/refresh`, { refreshToken })
      .pipe(tap((res) => this.saveSession(res)));
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
  }

  clearSession(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.baseUrl}/auth/revoke`, { refreshToken }).subscribe({ error: () => {} });
    }
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getCurrentUser(): UserModel | null {
    const raw = localStorage.getItem('current_user');
    return raw ? (JSON.parse(raw) as UserModel) : null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
