import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getData() {
  const today = new Date().toISOString();
  const res = await fetch(
    `http://localhost:3000/analytics/total_registered_price?date=${today}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function TotalRegisteredPriceCard() {
  const totalRegisteredPrice = await getData();
  const total = totalRegisteredPrice?._sum
    ? totalRegisteredPrice._sum.regiteredPrice
    : 0;
  return (
    <>
      <Card className="w-[350px] rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Total Registered Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{total} SEK</h2>
        </CardContent>
      </Card>
    </>
  );
}
