import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AppointmentModel, AppointmentStatus, UserModel } from '../../../core/models';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './appointment-status.component.html',
  styleUrl: './appointment-status.component.scss'
})
export class AppointmentStatusComponent implements OnInit {
  appointment?: AppointmentModel;
  staffMembers: UserModel[] = [];
  allowedStatuses: AppointmentStatus[] = [];
  errorMessage = '';
  successMessage = '';

  readonly form = this.formBuilder.group({
    assignedStaffId: [''],
    status: ['' as AppointmentStatus | '']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.appointmentService.getStaffMembers().subscribe((staffMembers) => {
      this.staffMembers = staffMembers;
    });

    this.route.paramMap
      .pipe(switchMap((params) => this.appointmentService.getAppointmentById(params.get('id') ?? '')))
      .subscribe({
        next: (appointment) => {
          this.appointment = appointment;
          this.allowedStatuses = this.appointmentService.getAllowedNextStatuses(appointment.status);
          this.form.patchValue({
            assignedStaffId: appointment.assignedStaffId ?? '',
            status: this.allowedStatuses[0] ?? ''
          });
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message ?? 'Appointment could not be found.';
        }
      });
  }

  onSave(): void {
    if (!this.appointment) {
      return;
    }

    const { assignedStaffId, status } = this.form.getRawValue();
    this.errorMessage = '';
    this.successMessage = '';

    this.appointmentService.assignStaff(this.appointment.id, assignedStaffId || null).subscribe({
      next: (updatedAppointment) => {
        this.appointment = updatedAppointment;

        if (!status) {
          this.successMessage = 'Staff assignment updated.';
          return;
        }

        this.appointmentService.updateAppointmentStatus(updatedAppointment.id, status).subscribe({
          next: (finalAppointment) => {
            this.appointment = finalAppointment;
            this.allowedStatuses = this.appointmentService.getAllowedNextStatuses(finalAppointment.status);
            this.form.patchValue({ status: this.allowedStatuses[0] ?? '' });
            this.successMessage = 'Appointment updated successfully.';
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage = error.error?.message ?? 'Unable to update the appointment status.';
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'Unable to update staff assignment.';
      }
    });
  }

  onBack(): void {
    void this.router.navigateByUrl('/appointments');
  }
}
