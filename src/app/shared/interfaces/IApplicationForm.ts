export interface IApplicationForm {
  afe: string;
  block: string;
  cumulativeProductionForWell: number;
  estimatedOperationsDays: number;
  expectedVolumes: number;
  field: string;
  initialReservesAllocationOfWell: number;
  landSize: number;
  lastProductionRate: number;
  natureOfOperation: string;
  plugBackInterval: number;
  postOperationProductionRate: number;
  proposedRig: string;
  rigForOperations: string;
  spudDate: Date;
  targetReserves: string;
  terrain: string;
  wellClassApplied: string;
  wellCompletionInterval: number;
  wellLocationCategory: string;
  wellName: string;
  wellPreSpudName: string;
  wellSpudName: string;
  wellSurfaceCoordinates: string;
}
