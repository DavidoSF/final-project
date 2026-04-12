import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models';
import { environment } from '../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserModel;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, request);
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
  }

  clearSession(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getCurrentUser(): UserModel | null {
    const raw = localStorage.getItem('current_user');
    return raw ? (JSON.parse(raw) as UserModel) : null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
