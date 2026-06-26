import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { logout } from '../../store/auth/auth.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { UserModel, ActivityLogModel } from '../../core/models';
import { ActivityLogService } from '../../core/services/activity-log.service';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss'
})
export class ActivityLogsComponent implements OnInit {
  currentUser$: Observable<UserModel | null>;

  logs: ActivityLogModel[] = [];
  filtered: ActivityLogModel[] = [];
  isLoading = true;
  error: string | null = null;

  searchQuery = '';
  selectedActionType = '';
  actionTypes: string[] = [];

  constructor(
    private readonly store: Store<AppState>,
    private readonly activityLogService: ActivityLogService
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {
    this.activityLogService.getAll(500).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.actionTypes = [...new Set(logs.map((l) => l.actionType))].sort();
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load activity logs.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    let result = this.logs;
    if (this.selectedActionType) {
      result = result.filter((l) => l.actionType === this.selectedActionType);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.description.toLowerCase().includes(q) ||
          l.performedByUserName.toLowerCase().includes(q) ||
          l.actionType.toLowerCase().includes(q)
      );
    }
    this.filtered = result;
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
