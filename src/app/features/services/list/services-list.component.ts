import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  allServices: ServiceModel[] = [];
  filtered: ServiceModel[] = [];
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.isLoading$ = this.store.select(selectServiceLoading);
    this.error$ = this.store.select(selectServiceError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadServices());
    this.store.select(selectAllServices).subscribe((services) => {
      this.allServices = services;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    let result = this.allServices;
    if (this.statusFilter === 'active') {
      result = result.filter((s) => s.isActive);
    } else if (this.statusFilter === 'inactive') {
      result = result.filter((s) => !s.isActive);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    this.filtered = result;
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
