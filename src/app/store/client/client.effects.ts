import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import * as ClientActions from './client.actions';
import { ClientService } from '../../core/services/client.service';

const toErrorMessage = (err: unknown, fallback: string) =>
  (err as any)?.error?.message ?? (err as any)?.message ?? fallback;

export const loadClientsEffect$ = createEffect(
  (actions$ = inject(Actions), clientService = inject(ClientService)) =>
    actions$.pipe(
      ofType(ClientActions.loadClients),
      switchMap(() =>
        clientService.getAll().pipe(
          map((clients) => ClientActions.loadClientsSuccess({ clients })),
          catchError((err) =>
            of(ClientActions.loadClientsFailure({ error: toErrorMessage(err, 'Failed to load clients.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const loadClientEffect$ = createEffect(
  (actions$ = inject(Actions), clientService = inject(ClientService)) =>
    actions$.pipe(
      ofType(ClientActions.loadClient),
      switchMap(({ id }) =>
        clientService.getById(id).pipe(
          map((client) => ClientActions.loadClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.loadClientFailure({ error: toErrorMessage(err, 'Failed to load client.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const createClientEffect$ = createEffect(
  (actions$ = inject(Actions), clientService = inject(ClientService)) =>
    actions$.pipe(
      ofType(ClientActions.createClient),
      mergeMap(({ request }) =>
        clientService.create(request).pipe(
          map((client) => ClientActions.createClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.createClientFailure({ error: toErrorMessage(err, 'Failed to create client.') }))
          )
        )
      )
    ),
  { functional: true }
);

export const updateClientEffect$ = createEffect(
  (actions$ = inject(Actions), clientService = inject(ClientService)) =>
    actions$.pipe(
      ofType(ClientActions.updateClient),
      mergeMap(({ request }) =>
        clientService.update(request).pipe(
          map((client) => ClientActions.updateClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.updateClientFailure({ error: toErrorMessage(err, 'Failed to update client.') }))
          )
        )
      )
    ),
  { functional: true }
);

