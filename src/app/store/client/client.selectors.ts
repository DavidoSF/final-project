import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.state';

export const selectClientState = createFeatureSelector<ClientState>('client');

export const selectAllClients = createSelector(
  selectClientState,
  (state) => state.clients
);

export const selectSelectedClient = createSelector(
  selectClientState,
  (state) => state.selectedClient
);

export const selectClientLoading = createSelector(
  selectClientState,
  (state) => state.isLoading
);

export const selectClientError = createSelector(
  selectClientState,
  (state) => state.error
);

export const selectClientById = (id: string) =>
  createSelector(selectAllClients, (clients) => clients.find((c) => c.id === id) ?? null);

