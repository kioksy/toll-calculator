import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getData() {
  const today = new Date().toISOString();
  const res = await fetch(
    `http://localhost:3000/analytics/total_log_entries?date=${today}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function TotalLogEntriesCard() {
  const totalLogEntries = await getData();
  const total = totalLogEntries?.total ? totalLogEntries.total : 0;
  return (
    <>
      <Card className="w-[350px] rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Total Passages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{total}</h2>
        </CardContent>
      </Card>
    </>
  );
}
