import { AuthState } from './auth/auth.state';
import { ServiceState } from './service/service.state';

export interface AppState {
  auth: AuthState;
  service: ServiceState;
}
