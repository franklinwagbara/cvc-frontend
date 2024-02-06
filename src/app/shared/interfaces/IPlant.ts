import { IMeter } from './IMeter';

// Interface for Depot and Processing Plant
export interface IPlant {
  id?: number;
  depotId?: number;
  appId?: number | null;
  name?: string | null;
  productId?: number;
  volume?: number;
  company?: string;
  email?: string;
  state?: string;
  elpsPlantId?: number;
  companyElpsId?: number;
  plantType?: number;
  isDeleted?: boolean;
  tanks?: [
    {
      plantTankId: number;
      plantId: number;
      tankName: string;
      product: string;
      capacity: number;
      position: string;
      isDeleted: boolean;
    }
  ];
  meters?: IMeter[];
}
