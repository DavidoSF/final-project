import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/app.state';
import {
  loadServices,
  deleteService,
  toggleServiceActive
} from '../../../store/service/service.actions';
import {
  selectAllServices,
  selectServiceLoading,
  selectServiceError
} from '../../../store/service/service.selectors';
import { ServiceModel } from '../../../core/models';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  services$: Observable<ServiceModel[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.services$ = this.store.select(selectAllServices);
    this.isLoading$ = this.store.select(selectServiceLoading);
    this.error$ = this.store.select(selectServiceError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadServices());
  }

  onEdit(service: ServiceModel): void {
    this.router.navigate(['/services', service.id, 'edit']);
  }

  onDelete(service: ServiceModel): void {
    if (confirm(`Delete "${service.name}"? This cannot be undone.`)) {
      this.store.dispatch(deleteService({ id: service.id }));
    }
  }

  onToggleActive(service: ServiceModel): void {
    this.store.dispatch(toggleServiceActive({ id: service.id }));
  }

  onAddNew(): void {
    this.router.navigate(['/services', 'new']);
  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
