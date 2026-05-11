export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
