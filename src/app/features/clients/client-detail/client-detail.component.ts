import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { ClientModel, AppointmentModel } from '../../../core/models';
import { ClientService } from '../../../core/services/client.service';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  client: ClientModel | null = null;
  appointments: AppointmentModel[] = [];
  isLoading = true;
  error: string | null = null;

  get totalRevenue(): number {
    return this.appointments
      .filter(a => a.status === 'Completed')
      .reduce((sum, a) => sum + a.priceAtBooking, 0);
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly clientService: ClientService,
    private readonly appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/clients']); return; }

    forkJoin({
      client: this.clientService.getById(id).pipe(catchError(() => of(null))),
      appointments: this.appointmentService.getAppointments({ clientId: id }).pipe(catchError(() => of([])))
    }).subscribe(({ client, appointments }) => {
      if (!client) {
        this.error = 'Client not found.';
      } else {
        this.client = client;
        this.appointments = [...appointments].sort(
          (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
        );
      }
      this.isLoading = false;
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
