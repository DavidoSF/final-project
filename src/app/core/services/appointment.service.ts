import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppointmentModel, AppointmentStatus, ClientModel, ServiceModel, UserModel } from '../models';
import { environment } from '../environments/environment';

export interface AppointmentFilters {
  status?: AppointmentStatus | '';
  serviceId?: string;
  clientId?: string;
}

export interface CreateAppointmentRequest {
  clientId: string;
  serviceId: string;
  assignedStaffId: string | null;
  scheduledDate: string;
  notes: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private readonly http: HttpClient) {}

  getAppointments(filters?: AppointmentFilters): Observable<AppointmentModel[]> {
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.serviceId) {
      params = params.set('serviceId', filters.serviceId);
    }

    if (filters?.clientId) {
      params = params.set('clientId', filters.clientId);
    }

    return this.http
      .get<ApiResponse<AppointmentModel[]>>(this.baseUrl, { params })
      .pipe(map((response) => response.data ?? []));
  }

  getAppointmentById(id: string): Observable<AppointmentModel> {
    return this.http
      .get<ApiResponse<AppointmentModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createAppointment(request: CreateAppointmentRequest): Observable<AppointmentModel> {
    return this.http
      .post<ApiResponse<AppointmentModel>>(this.baseUrl, request)
      .pipe(map((response) => response.data));
  }

  updateAppointmentStatus(id: string, nextStatus: AppointmentStatus): Observable<AppointmentModel> {
    return this.http
      .put<ApiResponse<AppointmentModel>>(`${this.baseUrl}/${id}/status`, { status: nextStatus })
      .pipe(map((response) => response.data));
  }

  assignStaff(id: string, assignedStaffId: string | null): Observable<AppointmentModel> {
    return this.http
      .put<ApiResponse<AppointmentModel>>(`${this.baseUrl}/${id}/assign-staff`, { assignedStaffId })
      .pipe(map((response) => response.data));
  }

  getClients(): Observable<ClientModel[]> {
    return this.http
      .get<ApiResponse<ClientModel[]>>(`${environment.apiUrl}/client`)
      .pipe(map((response) => response.data ?? []));
  }

  getServices(): Observable<ServiceModel[]> {
    return this.http
      .get<ApiResponse<ServiceModel[]>>(`${environment.apiUrl}/service`)
      .pipe(map((response) => response.data ?? []));
  }

  getStaffMembers(): Observable<UserModel[]> {
    return this.http
      .get<ApiResponse<UserModel[]>>(`${this.baseUrl}/staff-members`)
      .pipe(map((response) => response.data ?? []));
  }

  getAllowedNextStatuses(status: AppointmentStatus): AppointmentStatus[] {
    switch (status) {
      case 'Pending':
        return ['Approved', 'Rejected'];
      case 'Approved':
        return ['Completed', 'Cancelled'];
      default:
        return [];
    }
  }
}
