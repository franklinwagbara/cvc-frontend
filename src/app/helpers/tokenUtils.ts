import { JwtHelperService } from '@auth0/angular-jwt';

export const tokenNotExpired = (): boolean => {
  const jwtHelper = new JwtHelperService();
  const token = localStorage.getItem('token');

  if (!token) return false;

  const isExpired = jwtHelper.isTokenExpired(token);

  return !isExpired;
};

export const decodeFullUserInfo = (): any => {
  const jwtHelper = new JwtHelperService();
  const token = localStorage.getItem('token');
  const userFromApi = JSON.parse(localStorage.getItem('currentUser'));
  const decodedUser = jwtHelper.decodeToken(token);
  if (!userFromApi) return decodedUser;
  return { ...userFromApi, ...decodedUser }
}