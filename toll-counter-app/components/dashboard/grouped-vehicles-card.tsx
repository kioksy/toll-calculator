import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface GroupedVehicleRow {
  vehicletypeid: number;
  vehicletypename: string;
  count: number;
}

async function getData() {
  const today = new Date().toISOString();
  const res = await fetch(
    `http://localhost:3000/analytics/grouped_vehicles?date=${today}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function GroupedVehiclesCard() {
  const groupedVehicles = await getData();
  return (
    <>
      <Card className="w-[350px] rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Vehicles by type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Type</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedVehicles?.map(
                (groupedVehicleRow: GroupedVehicleRow, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {groupedVehicleRow.vehicletypename}
                    </TableCell>
                    <TableCell className="text-right">
                      {groupedVehicleRow.count}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
