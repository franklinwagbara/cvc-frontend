export interface ITank {
  id?: number;
  plantTankId: number;
  facilityId?: number;
  name?: string | null;
  capacity?: number;
  productId?: number;
  product?: string | null;
  position?: string | null;
  tankName?: string | null;
  plantId?: number;
}
