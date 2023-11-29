import { JwtHelperService } from '@auth0/angular-jwt';

export const tokenNotExpired = () => {
  let jwtHelper = new JwtHelperService();
  let token = localStorage.getItem('token');

  if (!token) return false;

  let isExpired = jwtHelper.isTokenExpired(token);

  return !isExpired;
};
