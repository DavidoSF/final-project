import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivityLogModel } from '../models';
import { environment } from '../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private readonly baseUrl = `${environment.apiUrl}/activitylog`;

  constructor(private readonly http: HttpClient) {}

  getAll(limit = 200): Observable<ActivityLogModel[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http
      .get<ApiResponse<ActivityLogModel[]>>(this.baseUrl, { params })
      .pipe(map((r) => r.data ?? []));
  }
}
