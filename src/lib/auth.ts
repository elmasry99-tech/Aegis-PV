const KEY = 'aegis_auth';

export const login = (u: string, p: string): boolean => {
  if (u === 'admin' && p === 'admin') {
    localStorage.setItem(KEY, '1');
    return true;
  }
  return false;
};

export const logout = () => localStorage.removeItem(KEY);

export const isAuthenticated = () =>
  typeof window !== 'undefined' && localStorage.getItem(KEY) === '1';
