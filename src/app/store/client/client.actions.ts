import { createAction, props } from '@ngrx/store';
import { ClientModel } from '../../core/models';
import { CreateClientRequest, UpdateClientRequest } from '../../core/services/client.service';

// Load all
export const loadClients = createAction('[Client] Load Clients');
export const loadClientsSuccess = createAction(
  '[Client] Load Clients Success',
  props<{ clients: ClientModel[] }>()
);
export const loadClientsFailure = createAction(
  '[Client] Load Clients Failure',
  props<{ error: string }>()
);

// Load one
export const loadClient = createAction(
  '[Client] Load Client',
  props<{ id: string }>()
);
export const loadClientSuccess = createAction(
  '[Client] Load Client Success',
  props<{ client: ClientModel }>()
);
export const loadClientFailure = createAction(
  '[Client] Load Client Failure',
  props<{ error: string }>()
);

// Create
export const createClient = createAction(
  '[Client] Create Client',
  props<{ request: CreateClientRequest }>()
);
export const createClientSuccess = createAction(
  '[Client] Create Client Success',
  props<{ client: ClientModel }>()
);
export const createClientFailure = createAction(
  '[Client] Create Client Failure',
  props<{ error: string }>()
);

// Update
export const updateClient = createAction(
  '[Client] Update Client',
  props<{ request: UpdateClientRequest }>()
);
export const updateClientSuccess = createAction(
  '[Client] Update Client Success',
  props<{ client: ClientModel }>()
);
export const updateClientFailure = createAction(
  '[Client] Update Client Failure',
  props<{ error: string }>()
);

