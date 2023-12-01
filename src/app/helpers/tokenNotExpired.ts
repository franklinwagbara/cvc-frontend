import { JwtHelperService } from '@auth0/angular-jwt';

export const tokenNotExpired = () => {
  const jwtHelper = new JwtHelperService();
  const token = localStorage.getItem('token');

  if (!token) return false;

  const isExpired = jwtHelper.isTokenExpired(token);

  return !isExpired;
};
