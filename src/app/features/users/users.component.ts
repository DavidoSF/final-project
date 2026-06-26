import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { logout } from '../../store/auth/auth.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { UserModel } from '../../core/models';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  currentUser$: Observable<UserModel | null>;

  users: UserModel[] = [];
  filtered: UserModel[] = [];
  isLoading = true;
  error: string | null = null;
  successMsg: string | null = null;

  searchQuery = '';
  selectedRole: 'Admin' | 'Staff' | '' = '';

  showCreateModal = false;
  createForm: FormGroup;
  createError: string | null = null;
  isCreating = false;

  constructor(
    private readonly store: Store<AppState>,
    private readonly userService: UserService,
    private readonly fb: FormBuilder
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.createForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['Staff', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    let result = this.users;
    if (this.selectedRole) {
      result = result.filter((u) => u.role === this.selectedRole);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    this.filtered = result;
  }

  onToggleActive(user: UserModel): void {
    this.userService.toggleActive(user.id).subscribe({
      next: (updated) => {
        this.users = this.users.map((u) => (u.id === updated.id ? updated : u));
        this.applyFilter();
        this.successMsg = `${updated.fullName} has been ${updated.isActive ? 'activated' : 'deactivated'}.`;
        setTimeout(() => (this.successMsg = null), 3000);
      },
      error: () => {
        this.error = 'Failed to update user status.';
      }
    });
  }

  openCreateModal(): void {
    this.createForm.reset({ role: 'Staff' });
    this.createError = null;
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onCreateSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.isCreating = true;
    this.createError = null;
    this.userService.create(this.createForm.value).subscribe({
      next: (user) => {
        this.users = [...this.users, user];
        this.applyFilter();
        this.isCreating = false;
        this.showCreateModal = false;
        this.successMsg = `User "${user.fullName}" created successfully.`;
        setTimeout(() => (this.successMsg = null), 3000);
      },
      error: (err) => {
        this.createError = err?.error?.message ?? 'Failed to create user.';
        this.isCreating = false;
      }
    });
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
