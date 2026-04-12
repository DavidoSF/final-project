import { createReducer, on } from '@ngrx/store';
import { ClientState, initialClientState } from './client.state';
import * as ClientActions from './client.actions';

export const clientReducer = createReducer<ClientState>(
  initialClientState,

  // Load all
  on(ClientActions.loadClients, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    isLoading: false,
    clients
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load one
  on(ClientActions.loadClient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ClientActions.loadClientSuccess, (state, { client }) => ({
    ...state,
    isLoading: false,
    selectedClient: client
  })),
  on(ClientActions.loadClientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create
  on(ClientActions.createClient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ClientActions.createClientSuccess, (state, { client }) => ({
    ...state,
    isLoading: false,
    clients: [...state.clients, client]
  })),
  on(ClientActions.createClientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update
  on(ClientActions.updateClient, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ClientActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    isLoading: false,
    clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    selectedClient: state.selectedClient?.id === client.id ? client : state.selectedClient
  })),
  on(ClientActions.updateClientFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);

