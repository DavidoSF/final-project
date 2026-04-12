import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, take, takeUntil } from 'rxjs';
import { AppState } from '../../../store/app.state';
import { createClient, loadClient, updateClient } from '../../../store/client/client.actions';
import {
  selectClientError,
  selectClientLoading,
  selectSelectedClient
} from '../../../store/client/client.selectors';
import { ClientModel } from '../../../core/models';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  isEditMode = false;
  clientId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      phoneNumber: ['', [Validators.maxLength(30)]],
      companyName: ['', [Validators.maxLength(200)]]
    });

    this.isLoading$ = this.store.select(selectClientLoading);
    this.error$ = this.store.select(selectClientError);

    this.clientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.clientId;

    if (this.isEditMode && this.clientId) {
      this.store.dispatch(loadClient({ id: this.clientId }));

      this.store
        .select(selectSelectedClient)
        .pipe(
          filter((c): c is ClientModel => c !== null && c.id === this.clientId),
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe((client) => {
          this.form.patchValue({
            fullName: client.fullName,
            email: client.email,
            phoneNumber: client.phoneNumber,
            companyName: client.companyName
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, phoneNumber, companyName } = this.form.value as {
      fullName: string;
      email: string;
      phoneNumber?: string;
      companyName?: string;
    };

    if (this.isEditMode && this.clientId) {
      this.store.dispatch(
        updateClient({
          request: {
            id: this.clientId,
            fullName,
            email,
            phoneNumber,
            companyName
          }
        })
      );
    } else {
      this.store.dispatch(
        createClient({
          request: {
            fullName,
            email,
            phoneNumber,
            companyName
          }
        })
      );
    }

    this.store
      .select(selectClientLoading)
      .pipe(
        filter((loading) => !loading),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store
          .select(selectClientError)
          .pipe(take(1))
          .subscribe((err) => {
            if (!err) {
              this.router.navigate(['/clients']);
            }
          });
      });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }

  field(name: string) {
    return this.form.get(name);
  }
}
