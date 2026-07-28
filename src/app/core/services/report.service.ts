import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AppointmentFilters } from './appointment.service';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly baseUrl = `${environment.apiUrl}/report`;

  constructor(private readonly http: HttpClient) {}

  exportAppointmentsCsv(filters?: AppointmentFilters): Observable<Blob> {
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

    return this.http.get(`${this.baseUrl}/appointments.csv`, {
      params,
      responseType: 'blob'
    });
  }
}
