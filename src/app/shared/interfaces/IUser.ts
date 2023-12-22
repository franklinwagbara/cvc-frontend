export interface IUser {
  id?: string | null;
  elpsId?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  roleId?: string | null;
  locationId?: number;
  officeId?: number;
  phone?: string | null;
  isActive?: boolean;
}