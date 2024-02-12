import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface GroupedLogEntry {
  _count: number;
  registeredPriceReason: string;
}

async function getData() {
  const today = new Date().toISOString();
  const res = await fetch(
    `http://localhost:3000/analytics/grouped_log_entries?date=${today}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function GroupedLogEntriesCard() {
  const groupedLogEntries = await getData();
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
                <TableHead>Entry type</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedLogEntries?.map(
                (groupedLogEntry: GroupedLogEntry, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {groupedLogEntry.registeredPriceReason.replaceAll(
                        '_',
                        ' '
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {groupedLogEntry._count}
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
