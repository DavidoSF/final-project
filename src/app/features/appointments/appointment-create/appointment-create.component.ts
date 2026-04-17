import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientModel, ServiceModel, UserModel } from '../../../core/models';
import {
  AppointmentService,
  CreateAppointmentRequest
} from '../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.scss'
})
export class AppointmentCreateComponent implements OnInit {
  clients: ClientModel[] = [];
  services: ServiceModel[] = [];
  staffMembers: UserModel[] = [];
  selectedPrice = 0;
  isSubmitting = false;
  errorMessage = '';

  readonly form = this.formBuilder.group({
    clientId: ['', Validators.required],
    serviceId: ['', Validators.required],
    assignedStaffId: [''],
    scheduledDate: ['', Validators.required],
    notes: ['']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly appointmentService: AppointmentService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    forkJoin({
      clients: this.appointmentService.getClients(),
      services: this.appointmentService.getServices(),
      staffMembers: this.appointmentService.getStaffMembers()
    }).subscribe({
      next: ({ clients, services, staffMembers }) => {
        this.clients = clients;
        this.services = services;
        this.staffMembers = staffMembers;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'Unable to load appointment form data.';
      }
    });

    this.form.controls.serviceId.valueChanges.subscribe((serviceId) => {
      this.selectedPrice = this.services.find((service) => service.id === serviceId)?.price ?? 0;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const rawValue = this.form.getRawValue();
    const request: CreateAppointmentRequest = {
      clientId: rawValue.clientId ?? '',
      serviceId: rawValue.serviceId ?? '',
      assignedStaffId: rawValue.assignedStaffId || null,
      scheduledDate: rawValue.scheduledDate ?? '',
      notes: rawValue.notes?.trim() ?? ''
    };

    this.appointmentService.createAppointment(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigateByUrl('/appointments');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message ?? 'Unable to create the appointment.';
      }
    });
  }
}
