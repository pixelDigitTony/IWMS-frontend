import { http } from './baseApi';

export type UserDto = {
  id: string;
  email: string;
  displayName?: string;
  companyName?: string;
  roles?: string[];
  approved?: boolean;
};

export type RegisterRequest = {
  email: string;
  displayName?: string;
  companyName?: string;
};

export type UpdateUserRequest = {
  email?: string;
  displayName?: string;
  companyName?: string;
  roles?: string[];
  approved?: boolean;
};

// Helper function to check if user is super admin based on roles
export function isSuperAdmin(user: UserDto): boolean {
  return user.roles?.includes('SUPER_ADMIN') ?? false;
}

export async function listUsers() {
  const { data } = await http.get<UserDto[]>(`/users`);
  return data;
}

export async function createUser(email: string) {
  const { data } = await http.post<UserDto>(`/users`, { email });
  return data;
}

export async function registerSelf(request: RegisterRequest) {
  await http.post(`/users/register`, request);
}

export async function updateUser(userId: string, payload: UpdateUserRequest) {
  const { data } = await http.patch<UserDto>(`/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId: string) {
  await http.delete(`/users/${userId}`);
}


