import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

export const loginEffect$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        authService.login({ email, password }).pipe(
          map((response) => AuthActions.loginSuccess({ token: response.token, user: response.user })),
          catchError((err) => {
            const message: string =
              err?.error?.message ?? 'Login failed. Please check your credentials.';
            return of(AuthActions.loginFailure({ error: message }));
          })
        )
      )
    ),
  { functional: true }
);

export const loginSuccessEffect$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ token, user }) => {
        authService.saveSession({ token, user });
        router.navigate(['/dashboard']);
      })
    ),
  { functional: true, dispatch: false }
);

export const logoutEffect$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        authService.clearSession();
        router.navigate(['/login']);
      })
    ),
  { functional: true, dispatch: false }
);
