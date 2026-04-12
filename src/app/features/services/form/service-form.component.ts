import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, filter, take, takeUntil } from 'rxjs';
import { AppState } from '../../../store/app.state';
import {
  createService,
  updateService,
  loadService
} from '../../../store/service/service.actions';
import {
  selectSelectedService,
  selectServiceLoading,
  selectServiceError
} from '../../../store/service/service.selectors';
import { ServiceModel } from '../../../core/models';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  isEditMode = false;
  serviceId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0)]],
      durationInMinutes: [null, [Validators.required, Validators.min(1)]]
    });

    this.isLoading$ = this.store.select(selectServiceLoading);
    this.error$ = this.store.select(selectServiceError);

    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.serviceId;

    if (this.isEditMode && this.serviceId) {
      this.store.dispatch(loadService({ id: this.serviceId }));

      this.store.select(selectSelectedService)
        .pipe(
          filter((s): s is ServiceModel => s !== null && s.id === this.serviceId),
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe((service) => {
          this.form.patchValue({
            name: service.name,
            description: service.description,
            price: service.price,
            durationInMinutes: service.durationInMinutes
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

    const { name, description, price, durationInMinutes } = this.form.value as {
      name: string;
      description: string;
      price: number;
      durationInMinutes: number;
    };

    if (this.isEditMode && this.serviceId) {
      this.store.dispatch(updateService({ id: this.serviceId, request: { name, description, price, durationInMinutes } }));
    } else {
      this.store.dispatch(createService({ request: { name, description, price, durationInMinutes } }));
    }

    this.store.select(selectServiceLoading)
      .pipe(
        filter((loading) => !loading),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.select(selectServiceError)
          .pipe(take(1))
          .subscribe((err) => {
            if (!err) {
              this.router.navigate(['/services']);
            }
          });
      });
  }

  onCancel(): void {
    this.router.navigate(['/services']);
  }

  field(name: string) {
    return this.form.get(name);
  }
}
