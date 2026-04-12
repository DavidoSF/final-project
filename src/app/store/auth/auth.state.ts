import { UserModel } from '../../core/models';

export interface AuthState {
  user: UserModel | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
};
