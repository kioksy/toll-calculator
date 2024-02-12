import { PageHeading } from '@/components/page-heading';
import { TollLogTable } from '@/components/toll-log';
import { VehicleInfoCard } from '@/components/vehicle-info/vehicle-info-card';
import { VehicleInfoPaymentLogCard } from '@/components/vehicle-info/vehicle-info-payment-log';
import { VehicleTollLogTable } from '@/components/vehicle-info/vehicle-info-toll-log';

interface VehicleInfo {
  id: number;
  regNr: string;
  vehicleTypeId: number;
  VehicleType: VehicleTypeInfo;
  tollRegistrationLogs: VehicleTollLog[];
}

interface VehicleTypeInfo {
  id: number;
  name: string;
  has_pricing: boolean;
}

export interface VehicleTollLog {
  id: number;
  vehicleId: number;
  registeredAt: string;
  regiteredPrice: number;
  registeredPriceReason: string;
}

interface SummedPriceByDate {
  date: string;
  value: number;
}

function sumPricesByDate(logs: VehicleTollLog[]): SummedPriceByDate[] {
  const sumByDate: { [date: string]: number } = {};

  logs.forEach((log) => {
    const date = log.registeredAt.split('T')[0];
    if (!sumByDate[date]) {
      sumByDate[date] = 0;
    }
    sumByDate[date] += log.regiteredPrice;
  });

  const result: SummedPriceByDate[] = Object.entries(sumByDate).map(
    ([date, value]) => ({
      date,
      value,
    })
  );

  return result;
}

function getVehicleInfo(vehicleInfo: VehicleInfo) {
  const lastScan =
    vehicleInfo.tollRegistrationLogs.length > 0
      ? vehicleInfo.tollRegistrationLogs[0].registeredAt
      : '';
  return {
    regNr: vehicleInfo.regNr,
    vehicleTypeName: vehicleInfo.VehicleType.name,
    lastScan: lastScan,
  };
}

async function getData(regNr: string) {
  const res = await fetch(`http://localhost:3000/vehicles/${regNr}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function VehicleInfo({
  params,
}: {
  params: { slug: string };
}) {
  const vehicleData = (await getData(params.slug)) as VehicleInfo;
  const totalPricePerDay = sumPricesByDate(vehicleData.tollRegistrationLogs);
  const vehicleInfoData = getVehicleInfo(vehicleData);
  return (
    <>
      <PageHeading title="Vehicle info" />
      <VehicleInfoCard
        regNr={vehicleInfoData.regNr}
        vehicleTypeName={vehicleInfoData.vehicleTypeName}
        lastScan={vehicleInfoData.lastScan}
      />
      <VehicleInfoPaymentLogCard paymentLog={totalPricePerDay} />
      <VehicleTollLogTable tollLog={vehicleData.tollRegistrationLogs} />
    </>
  );
}
