import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getData() {
  const today = new Date().toISOString();
  const res = await fetch(
    `http://localhost:3000/analytics/total_vehicles?date=${today}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function TotalVehiclesCard() {
  const totalVehicles = await getData();
  const total = totalVehicles?.total ? totalVehicles.total : 0;
  return (
    <>
      <Card className="w-[350px] rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Total Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{total}</h2>
        </CardContent>
      </Card>
    </>
  );
}
