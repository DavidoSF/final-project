import { createAction, props } from '@ngrx/store';
import { ServiceModel } from '../../core/models';
import { CreateServiceRequest, UpdateServiceRequest } from '../../core/services/service.service';

// Load all
export const loadServices = createAction('[Service] Load Services');
export const loadServicesSuccess = createAction(
  '[Service] Load Services Success',
  props<{ services: ServiceModel[] }>()
);
export const loadServicesFailure = createAction(
  '[Service] Load Services Failure',
  props<{ error: string }>()
);

// Load one
export const loadService = createAction(
  '[Service] Load Service',
  props<{ id: string }>()
);
export const loadServiceSuccess = createAction(
  '[Service] Load Service Success',
  props<{ service: ServiceModel }>()
);
export const loadServiceFailure = createAction(
  '[Service] Load Service Failure',
  props<{ error: string }>()
);

// Create
export const createService = createAction(
  '[Service] Create Service',
  props<{ request: CreateServiceRequest }>()
);
export const createServiceSuccess = createAction(
  '[Service] Create Service Success',
  props<{ service: ServiceModel }>()
);
export const createServiceFailure = createAction(
  '[Service] Create Service Failure',
  props<{ error: string }>()
);

// Update
export const updateService = createAction(
  '[Service] Update Service',
  props<{ id: string; request: UpdateServiceRequest }>()
);
export const updateServiceSuccess = createAction(
  '[Service] Update Service Success',
  props<{ service: ServiceModel }>()
);
export const updateServiceFailure = createAction(
  '[Service] Update Service Failure',
  props<{ error: string }>()
);

// Delete
export const deleteService = createAction(
  '[Service] Delete Service',
  props<{ id: string }>()
);
export const deleteServiceSuccess = createAction(
  '[Service] Delete Service Success',
  props<{ id: string }>()
);
export const deleteServiceFailure = createAction(
  '[Service] Delete Service Failure',
  props<{ error: string }>()
);

// Toggle active
export const toggleServiceActive = createAction(
  '[Service] Toggle Active',
  props<{ id: string }>()
);
export const toggleServiceActiveSuccess = createAction(
  '[Service] Toggle Active Success',
  props<{ service: ServiceModel }>()
);
export const toggleServiceActiveFailure = createAction(
  '[Service] Toggle Active Failure',
  props<{ error: string }>()
);
