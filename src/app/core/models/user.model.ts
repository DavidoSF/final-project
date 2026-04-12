export interface UserModel {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Staff';
  isActive: boolean;
  createdAt: string;
}
