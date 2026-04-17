import { AuthState } from './auth/auth.state';
import { ClientState } from './client/client.state';
import { ServiceState } from './service/service.state';

export interface AppState {
  auth: AuthState;
  client: ClientState;
  service: ServiceState;
}
