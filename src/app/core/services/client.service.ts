import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClientModel } from '../models';
import { environment } from '../environments/environment';

export interface CreateClientRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
}

export interface UpdateClientRequest {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly baseUrl = `${environment.apiUrl}/Client`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClientModel[]> {
    return this.http.get<unknown>(this.baseUrl).pipe(map((res) => this.normalizeClientListResponse(res)));
  }

  getById(id: string): Observable<ClientModel> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(map((res) => this.normalizeClientResponse(res)));
  }

  create(request: CreateClientRequest): Observable<ClientModel> {
    return this.http.post<unknown>(this.baseUrl, request).pipe(map((res) => this.normalizeClientResponse(res)));
  }

  update(request: UpdateClientRequest): Observable<ClientModel> {
    return this.http.put<unknown>(this.baseUrl, request).pipe(map((res) => this.normalizeClientResponse(res)));
  }

  private normalizeClientListResponse(response: unknown): ClientModel[] {
    if (Array.isArray(response)) return response.map((c) => this.coerceClientModel(c));

    if (response && typeof response === 'object') {
      const obj = response as Record<string, unknown>;
      const candidates = [obj['clients'], obj['data'], obj['items'], obj['results'], obj['result'], obj['value']];

      for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate.map((c) => this.coerceClientModel(c));
      }
    }

    throw new Error('Invalid "get all clients" API response (expected an array).');
  }

  private normalizeClientResponse(response: unknown): ClientModel {
    if (response && typeof response === 'object') {
      const obj = response as Record<string, unknown>;
      const candidates = [obj['client'], obj['data'], obj['item'], obj['result'], obj['value'], response];

      for (const candidate of candidates) {
        try {
          return this.coerceClientModel(candidate);
        } catch {
          // try next
        }
      }
    }

    throw new Error('Invalid client API response (expected an object).');
  }

  private coerceClientModel(raw: unknown): ClientModel {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid client object.');
    const obj = raw as Record<string, unknown>;

    const id = (obj['id'] ?? obj['Id']) as unknown;
    if (id === undefined || id === null || id === '') throw new Error('Client is missing id.');

    return {
      id: String(id),
      fullName: String((obj['fullName'] ?? obj['FullName'] ?? '') as unknown),
      email: String((obj['email'] ?? obj['Email'] ?? '') as unknown),
      phoneNumber: String((obj['phoneNumber'] ?? obj['PhoneNumber'] ?? '') as unknown),
      companyName: String((obj['companyName'] ?? obj['CompanyName'] ?? '') as unknown),
      createdAt: String((obj['createdAt'] ?? obj['CreatedAt'] ?? '') as unknown)
    };
  }
}

