import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserModel } from '../models';
import { environment } from '../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Staff';
}

export interface UpdateUserRequest {
  id: string;
  fullName?: string;
  email?: string;
  role?: 'Admin' | 'Staff';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<UserModel[]> {
    return this.http
      .get<ApiResponse<UserModel[]>>(this.baseUrl)
      .pipe(map((r) => r.data ?? []));
  }

  create(request: CreateUserRequest): Observable<UserModel> {
    return this.http
      .post<ApiResponse<UserModel>>(this.baseUrl, request)
      .pipe(map((r) => r.data));
  }

  update(request: UpdateUserRequest): Observable<UserModel> {
    return this.http
      .put<ApiResponse<UserModel>>(this.baseUrl, request)
      .pipe(map((r) => r.data));
  }

  toggleActive(id: string): Observable<UserModel> {
    return this.http
      .patch<ApiResponse<UserModel>>(`${this.baseUrl}/${id}/toggle-active`, {})
      .pipe(map((r) => r.data));
  }
}
