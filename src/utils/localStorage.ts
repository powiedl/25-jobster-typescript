import { User } from '@/features/user/userSlice';

export const addUserToLocalStorage = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem('user');
};
