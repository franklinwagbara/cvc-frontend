export interface IRole {
  id: string;
  name: string;
  normalizedName: string;
  description: string;
  userRoles: string;
  concurrencyStamp: string;
}
