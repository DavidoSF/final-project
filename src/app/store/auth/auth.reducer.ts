import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer<AuthState>(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    isLoading: false,
    token,
    user,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(AuthActions.logout, () => initialAuthState),

  on(AuthActions.restoreSession, (state) => {
    const token = localStorage.getItem('jwt_token');
    const rawUser = localStorage.getItem('current_user');
    const user = rawUser ? JSON.parse(rawUser) : null;
    return token && user ? { ...state, token, user } : state;
  })
);
