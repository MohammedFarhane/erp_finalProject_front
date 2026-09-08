export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  archived: boolean;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateRequest {
  name: string;
  email: string;
  role: UserRole;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
