import { IState } from "./IState";

export interface IAppDepot {
  id: number;
  depotId: number;
  // appId: number;
  name: string;
  state: IState;
  stateName?: string;
  productId: number;
  volume: number;
  product?: string;
}