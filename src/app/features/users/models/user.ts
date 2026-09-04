export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
