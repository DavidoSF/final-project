import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ServiceState } from './service.state';

export const selectServiceState = createFeatureSelector<ServiceState>('service');

export const selectAllServices = createSelector(
  selectServiceState,
  (state) => state.services
);

export const selectActiveServices = createSelector(
  selectAllServices,
  (services) => services.filter((s) => s.isActive)
);

export const selectSelectedService = createSelector(
  selectServiceState,
  (state) => state.selectedService
);

export const selectServiceLoading = createSelector(
  selectServiceState,
  (state) => state.isLoading
);

export const selectServiceError = createSelector(
  selectServiceState,
  (state) => state.error
);

export const selectServiceById = (id: string) =>
  createSelector(selectAllServices, (services) => services.find((s) => s.id === id) ?? null);
