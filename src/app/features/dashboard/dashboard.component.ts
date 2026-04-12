import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { logout } from '../../store/auth/auth.actions';
import { selectCurrentUser, selectIsAdmin } from '../../store/auth/auth.selectors';
import { UserModel } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser$: Observable<UserModel | null>;
  isAdmin$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAdmin$ = this.store.select(selectIsAdmin);
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
