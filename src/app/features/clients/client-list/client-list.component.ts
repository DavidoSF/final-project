import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/app.state';
import { loadClients } from '../../../store/client/client.actions';
import {
  selectAllClients,
  selectClientLoading,
  selectClientError
} from '../../../store/client/client.selectors';
import { selectIsAdmin } from '../../../store/auth/auth.selectors';
import { ClientModel } from '../../../core/models';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
  clients$: Observable<ClientModel[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAdmin$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.clients$ = this.store.select(selectAllClients);
    this.isLoading$ = this.store.select(selectClientLoading);
    this.error$ = this.store.select(selectClientError);
    this.isAdmin$ = this.store.select(selectIsAdmin);
  }

  ngOnInit(): void {
    this.store.dispatch(loadClients());
  }

  onAddNew(): void {
    this.router.navigate(['/clients', 'new']);
  }

  onEdit(client: ClientModel): void {
    this.router.navigate(['/clients', client.id, 'edit']);
  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

