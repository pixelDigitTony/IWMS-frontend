import { http } from './baseApi';

export type UserDto = {
  id: string;
  email: string;
  displayName?: string;
  roles?: string[];
  approved?: boolean;
  superAdmin?: boolean;
};

export async function listUsers() {
  const { data } = await http.get<UserDto[]>(`/users`);
  return data;
}

export async function createUser(email: string) {
  const { data } = await http.post<UserDto>(`/users`, { email });
  return data;
}

export async function registerSelf(email: string) {
  await http.post(`/users/register`, { email });
}


