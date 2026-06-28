import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface MonthlyRevenue {
  year: number;
  month: number;
  monthLabel: string;
  revenue: number;
  totalAppointments: number;
  completedAppointments: number;
}

export interface DailyAppointments {
  date: string;
  count: number;
}

export interface DashboardAnalytics {
  monthlyRevenue: MonthlyRevenue[];
  dailyAppointments: DailyAppointments[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private readonly http: HttpClient) {}

  getAnalytics(): Observable<DashboardAnalytics> {
    return this.http
      .get<ApiResponse<DashboardAnalytics>>(`${this.baseUrl}/analytics`)
      .pipe(map((r) => r.data));
  }
}
