import { ServiceModel } from '../../core/models';

export interface ServiceState {
  services: ServiceModel[];
  selectedService: ServiceModel | null;
  isLoading: boolean;
  error: string | null;
}

export const initialServiceState: ServiceState = {
  services: [],
  selectedService: null,
  isLoading: false,
  error: null
};
