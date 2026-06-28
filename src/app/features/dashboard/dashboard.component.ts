import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, forkJoin, catchError, of } from 'rxjs';
import { AppState } from '../../store/app.state';
import { logout } from '../../store/auth/auth.actions';
import { selectCurrentUser, selectIsAdmin } from '../../store/auth/auth.selectors';
import { UserModel, AppointmentModel } from '../../core/models';
import { AppointmentService } from '../../core/services/appointment.service';
import { ClientService } from '../../core/services/client.service';
import { ServiceService } from '../../core/services/service.service';
import { DashboardService, MonthlyRevenue } from '../../core/services/dashboard.service';
import { environment } from '../../core/environments/environment';

export interface DashboardStats {
  totalClients: number;
  totalServices: number;
  totalAppointments: number;
  pending: number;
  approved: number;
  completed: number;
  cancelled: number;
  rejected: number;
  totalRevenue: number;
}

export interface TopService {
  name: string;
  count: number;
  revenue: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<UserModel | null>;
  isAdmin$: Observable<boolean>;

  stats: DashboardStats | null = null;
  recentAppointments: AppointmentModel[] = [];
  topServices: TopService[] = [];
  monthlyRevenue: MonthlyRevenue[] = [];
  isLoading = true;

  readonly csvUrl = `${environment.apiUrl}/report/appointments.csv`;

  constructor(
    private readonly store: Store<AppState>,
    private readonly appointmentService: AppointmentService,
    private readonly clientService: ClientService,
    private readonly serviceService: ServiceService,
    private readonly dashboardService: DashboardService
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAdmin$ = this.store.select(selectIsAdmin);
  }

  ngOnInit(): void {
    forkJoin({
      appointments: this.appointmentService.getAppointments().pipe(catchError(() => of([]))),
      clients: this.clientService.getAll().pipe(catchError(() => of([]))),
      services: this.serviceService.getAll().pipe(catchError(() => of([]))),
      analytics: this.dashboardService.getAnalytics().pipe(catchError(() => of(null)))
    }).subscribe(({ appointments, clients, services, analytics }) => {
      this.computeStats(appointments, clients.length, services.length);
      this.recentAppointments = [...appointments]
        .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
        .slice(0, 6);
      this.computeTopServices(appointments);
      if (analytics) this.monthlyRevenue = analytics.monthlyRevenue;
      this.isLoading = false;
    });
  }

  private computeStats(
    appointments: AppointmentModel[],
    totalClients: number,
    totalServices: number
  ): void {
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const approved = appointments.filter(a => a.status === 'Approved').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
    const rejected = appointments.filter(a => a.status === 'Rejected').length;
    const totalRevenue = appointments
      .filter(a => a.status === 'Completed')
      .reduce((sum, a) => sum + a.priceAtBooking, 0);

    this.stats = {
      totalClients,
      totalServices,
      totalAppointments: appointments.length,
      pending,
      approved,
      completed,
      cancelled,
      rejected,
      totalRevenue
    };
  }

  private computeTopServices(appointments: AppointmentModel[]): void {
    const map = new Map<string, { name: string; count: number; revenue: number }>();
    for (const a of appointments) {
      const entry = map.get(a.serviceId) ?? { name: a.serviceName, count: 0, revenue: 0 };
      entry.count++;
      if (a.status === 'Completed') entry.revenue += a.priceAtBooking;
      map.set(a.serviceId, entry);
    }
    const sorted = [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
    const maxCount = sorted[0]?.count ?? 1;
    this.topServices = sorted.map(s => ({
      ...s,
      percent: Math.round((s.count / maxCount) * 100)
    }));
  }

  getStatusPercent(count: number): number {
    if (!this.stats?.totalAppointments) return 0;
    return Math.round((count / this.stats.totalAppointments) * 100);
  }

  getMonthlyRevenuePercent(revenue: number): number {
    const max = Math.max(...this.monthlyRevenue.map(m => m.revenue), 1);
    return Math.round((revenue / max) * 100);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
