export interface LoginResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    roles: string[];
    firstName: string;
    lastName: string;
  };
}
