import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AppointmentModel, AppointmentStatus, ClientModel, ServiceModel } from '../../../core/models';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.scss'
})
export class AppointmentsListComponent implements OnInit {
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
    private readonly appointmentService: AppointmentService
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
}
