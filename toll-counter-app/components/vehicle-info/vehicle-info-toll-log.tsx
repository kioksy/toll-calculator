import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { VehicleTollLog } from '@/app/vehicle-info/[slug]/page';

interface VehicleInfoTollLogProps {
  tollLog: VehicleTollLog[];
}

export function VehicleTollLogTable({ tollLog }: VehicleInfoTollLogProps) {
  return (
    <>
      <Card className="rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Vehicle Toll Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registered At</TableHead>
                <TableHead>Registered Price</TableHead>
                <TableHead>Registration Tag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tollLog?.map((tollRow: VehicleTollLog, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {tollRow.registeredAt.replace('T', ' ').slice(0, 19)}
                  </TableCell>
                  <TableCell className="font-bold">
                    {tollRow.regiteredPrice} SEK
                  </TableCell>
                  <TableCell>
                    {tollRow.registeredPriceReason.replaceAll('_', ' ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
