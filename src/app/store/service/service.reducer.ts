import { createReducer, on } from '@ngrx/store';
import { ServiceState, initialServiceState } from './service.state';
import * as ServiceActions from './service.actions';

export const serviceReducer = createReducer<ServiceState>(
  initialServiceState,

  // Load all
  on(ServiceActions.loadServices, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ServiceActions.loadServicesSuccess, (state, { services }) => ({
    ...state,
    isLoading: false,
    services
  })),
  on(ServiceActions.loadServicesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load one
  on(ServiceActions.loadService, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ServiceActions.loadServiceSuccess, (state, { service }) => ({
    ...state,
    isLoading: false,
    selectedService: service
  })),
  on(ServiceActions.loadServiceFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create
  on(ServiceActions.createService, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ServiceActions.createServiceSuccess, (state, { service }) => ({
    ...state,
    isLoading: false,
    services: [...state.services, service]
  })),
  on(ServiceActions.createServiceFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update
  on(ServiceActions.updateService, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ServiceActions.updateServiceSuccess, (state, { service }) => ({
    ...state,
    isLoading: false,
    services: state.services.map((s) => (s.id === service.id ? service : s)),
    selectedService: state.selectedService?.id === service.id ? service : state.selectedService
  })),
  on(ServiceActions.updateServiceFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete
  on(ServiceActions.deleteService, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ServiceActions.deleteServiceSuccess, (state, { id }) => ({
    ...state,
    isLoading: false,
    services: state.services.filter((s) => s.id !== id),
    selectedService: state.selectedService?.id === id ? null : state.selectedService
  })),
  on(ServiceActions.deleteServiceFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Toggle active
  on(ServiceActions.toggleServiceActive, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(ServiceActions.toggleServiceActiveSuccess, (state, { service }) => ({
    ...state,
    isLoading: false,
    services: state.services.map((s) => (s.id === service.id ? service : s)),
    selectedService: state.selectedService?.id === service.id ? service : state.selectedService
  })),
  on(ServiceActions.toggleServiceActiveFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
