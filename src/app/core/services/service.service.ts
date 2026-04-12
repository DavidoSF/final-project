import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { ServiceModel } from '../models';
import { environment } from '../environments/environment';

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
}

export interface UpdateServiceRequest {
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly baseUrl = `${environment.apiUrl}/Service`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ServiceModel[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(map((res) => this.normalizeServiceListResponse(res)));
  }

  getById(id: string): Observable<ServiceModel> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(map((res) => this.normalizeServiceResponse(res)));
  }

  create(request: CreateServiceRequest): Observable<ServiceModel> {
    return this.http.post<unknown>(this.baseUrl, request).pipe(map((res) => this.normalizeServiceResponse(res)));
  }

  update(id: string, request: UpdateServiceRequest): Observable<ServiceModel> {
    // Swagger shows `PUT /api/Service` (no `{id}`), but some backends still expose `PUT /api/Service/{id}`.
    // Try body-with-id first, then fall back to `{id}` route if needed.
    return this.http.put<unknown>(this.baseUrl, { id, ...request }).pipe(
      map((res) => this.normalizeServiceResponse(res)),
      catchError(() =>
        this.http
          .put<unknown>(`${this.baseUrl}/${encodeURIComponent(id)}`, request)
          .pipe(map((res) => this.normalizeServiceResponse(res)))
      )
    );
  }

  delete(id: string): Observable<void> {
    // Swagger shows `DELETE /api/Service` (no `{id}`), but backends differ on how the id is provided.
    // Try query param (`id`, then `serviceId`), then body, then `{id}` route.
    const urlWithId = `${this.baseUrl}/${encodeURIComponent(id)}`;

    const withParam = (key: string) => this.http.delete<void>(this.baseUrl, { params: new HttpParams().set(key, id) });
    const withBody = (key: string) => this.http.delete<void>(this.baseUrl, { body: { [key]: id } });

    // Prefer body first to avoid 415s on servers that require JSON content-type for DELETE.
    return withBody('id').pipe(
      catchError(() => withBody('serviceId')),
      catchError(() => withParam('id')),
      catchError(() => withParam('serviceId')),
      catchError(() => this.http.delete<void>(urlWithId))
    );
  }

  toggleActive(id: string): Observable<ServiceModel> {
    // Swagger shows `PATCH /api/Service/toggle-active`. Backends vary on whether `id` is query or body.
    const url = `${this.baseUrl}/toggle-active`;
    // Try body first to avoid generating noisy 404s on servers that don't route query-string variants.
    return this.http.patch<unknown>(url, { id }).pipe(
      map((res) => this.normalizeServiceResponse(res)),
      catchError(() =>
        this.http.patch<unknown>(url, {}, { params: new HttpParams().set('id', id) }).pipe(
          map((res) => this.normalizeServiceResponse(res)),
          catchError(() =>
            this.http
              .patch<unknown>(`${this.baseUrl}/${encodeURIComponent(id)}/toggle`, {})
              .pipe(map((res) => this.normalizeServiceResponse(res)))
          )
        )
      )
    );
  }

  private normalizeServiceListResponse(response: unknown): ServiceModel[] {
    if (Array.isArray(response)) return response.map((s) => this.coerceServiceModel(s));

    if (response && typeof response === 'object') {
      const obj = response as Record<string, unknown>;
      const candidates = [
        obj['services'],
        obj['data'],
        obj['items'],
        obj['results'],
        obj['result'],
        obj['value']
      ];

      for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate.map((s) => this.coerceServiceModel(s));
      }
    }

    throw new Error('Invalid "get all services" API response (expected an array).');
  }

  private normalizeServiceResponse(response: unknown): ServiceModel {
    if (response && typeof response === 'object') {
      const obj = response as Record<string, unknown>;
      const candidates = [
        obj['service'],
        obj['data'],
        obj['item'],
        obj['result'],
        obj['value'],
        response
      ];

      for (const candidate of candidates) {
        try {
          return this.coerceServiceModel(candidate);
        } catch {
          // try next candidate
        }
      }
    }

    throw new Error('Invalid service API response (expected an object).');
  }

  private coerceServiceModel(raw: unknown): ServiceModel {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid service object.');
    const obj = raw as Record<string, unknown>;

    const id = (obj['id'] ?? obj['Id']) as unknown;
    if (id === undefined || id === null || id === '') throw new Error('Service is missing id.');

    return {
      id: String(id),
      name: String((obj['name'] ?? obj['Name'] ?? '') as unknown),
      description: String((obj['description'] ?? obj['Description'] ?? '') as unknown),
      price: Number((obj['price'] ?? obj['Price'] ?? 0) as unknown),
      durationInMinutes: Number((obj['durationInMinutes'] ?? obj['DurationInMinutes'] ?? 0) as unknown),
      isActive: Boolean((obj['isActive'] ?? obj['IsActive'] ?? false) as unknown),
      createdAt: String((obj['createdAt'] ?? obj['CreatedAt'] ?? '') as unknown)
    };
  }
}
