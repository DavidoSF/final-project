import { ClientModel } from '../../core/models';

export interface ClientState {
  clients: ClientModel[];
  selectedClient: ClientModel | null;
  isLoading: boolean;
  error: string | null;
}

export const initialClientState: ClientState = {
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null
};

