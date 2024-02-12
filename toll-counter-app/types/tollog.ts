export interface TollLog {
  id: number;
  vehicleId: number;
  regNr: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  registeredAt: string;
  regiteredPrice: number;
  registeredPriceReason: string;
}
