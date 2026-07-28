import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AppointmentModel, AppointmentStatus, ClientModel, ServiceModel } from '../../../core/models';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.scss'
})
export class AppointmentsListComponent implements OnInit {
  isExporting = false;
  exportError: string | null = null;

  readonly statuses: Array<AppointmentStatus | ''> = [
    '',
    'Pending',
    'Approved',
    'Rejected',
    'Completed',
    'Cancelled'
  ];
  readonly selectableStatuses = this.statuses.filter(
    (status): status is AppointmentStatus => status !== ''
  );

  readonly filterForm = this.formBuilder.group({
    status: ['' as AppointmentStatus | ''],
    serviceId: [''],
    clientId: ['']
  });

  appointments$!: Observable<AppointmentModel[]>;
  clients$!: Observable<ClientModel[]>;
  services$!: Observable<ServiceModel[]>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly appointmentService: AppointmentService,
    private readonly reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.clients$ = this.appointmentService.getClients();
    this.services$ = this.appointmentService.getServices();

    this.appointments$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.getRawValue()),
      switchMap((filters) =>
        this.appointmentService.getAppointments({
          status: filters.status ?? '',
          serviceId: filters.serviceId ?? '',
          clientId: filters.clientId ?? ''
        })
      )
    );
  }

  trackByAppointment(_: number, appointment: AppointmentModel): string {
    return appointment.id;
  }

  getStatusClass(status: AppointmentStatus): string {
    return status.toLowerCase();
  }

  exportCsv(): void {
    if (this.isExporting) {
      return;
    }

    this.isExporting = true;
    this.exportError = null;

    const filters = this.filterForm.getRawValue();

    this.reportService
      .exportAppointmentsCsv({
        status: filters.status ?? '',
        serviceId: filters.serviceId ?? '',
        clientId: filters.clientId ?? ''
      })
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.href = url;
          link.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;

          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);

          this.isExporting = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.exportError = 'Your session has expired. Please log in again to export.';
          } else if (error.status === 403) {
            this.exportError = 'You do not have permission to export appointments.';
          } else {
            this.exportError = 'Failed to export appointments. Please try again.';
          }

          this.isExporting = false;
        }
      });
  }
}
