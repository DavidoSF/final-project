import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import * as ServiceActions from './service.actions';
import { ServiceService } from '../../core/services/service.service';

const toErrorMessage = (err: unknown, fallback: string) =>
  (err as any)?.error?.message ?? (err as any)?.message ?? fallback;

export const loadServicesEffect$ = createEffect(
  (actions$ = inject(Actions), serviceService = inject(ServiceService)) =>
    actions$.pipe(
      ofType(ServiceActions.loadServices),
      switchMap(() =>
        serviceService.getAll().pipe(
          map((services) => ServiceActions.loadServicesSuccess({ services })),
          catchError((err) =>
            of(
              ServiceActions.loadServicesFailure({
                error: toErrorMessage(err, 'Failed to load services.')
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const loadServiceEffect$ = createEffect(
  (actions$ = inject(Actions), serviceService = inject(ServiceService)) =>
    actions$.pipe(
      ofType(ServiceActions.loadService),
      switchMap(({ id }) =>
        serviceService.getById(id).pipe(
          map((service) => ServiceActions.loadServiceSuccess({ service })),
          catchError((err) =>
            of(ServiceActions.loadServiceFailure({ error: toErrorMessage(err, 'Failed to load service.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const createServiceEffect$ = createEffect(
  (actions$ = inject(Actions), serviceService = inject(ServiceService)) =>
    actions$.pipe(
      ofType(ServiceActions.createService),
      mergeMap(({ request }) =>
        serviceService.create(request).pipe(
          map((service) => ServiceActions.createServiceSuccess({ service })),
          catchError((err) =>
            of(ServiceActions.createServiceFailure({ error: toErrorMessage(err, 'Failed to create service.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const updateServiceEffect$ = createEffect(
  (actions$ = inject(Actions), serviceService = inject(ServiceService)) =>
    actions$.pipe(
      ofType(ServiceActions.updateService),
      mergeMap(({ id, request }) =>
        serviceService.update(id, request).pipe(
          map((service) => ServiceActions.updateServiceSuccess({ service })),
          catchError((err) =>
            of(ServiceActions.updateServiceFailure({ error: toErrorMessage(err, 'Failed to update service.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const deleteServiceEffect$ = createEffect(
  (actions$ = inject(Actions), serviceService = inject(ServiceService)) =>
    actions$.pipe(
      ofType(ServiceActions.deleteService),
      mergeMap(({ id }) =>
        serviceService.delete(id).pipe(
          map(() => ServiceActions.deleteServiceSuccess({ id })),
          catchError((err) =>
            of(ServiceActions.deleteServiceFailure({ error: toErrorMessage(err, 'Failed to delete service.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const toggleServiceActiveEffect$ = createEffect(
  (actions$ = inject(Actions), serviceService = inject(ServiceService)) =>
    actions$.pipe(
      ofType(ServiceActions.toggleServiceActive),
      mergeMap(({ id }) =>
        serviceService.toggleActive(id).pipe(
          map((service) => ServiceActions.toggleServiceActiveSuccess({ service })),
          catchError((err) =>
            of(ServiceActions.toggleServiceActiveFailure({ error: toErrorMessage(err, 'Failed to toggle service.') }))
          )
        )
      )
    ),
  { functional: true }
);
