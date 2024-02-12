import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VehicleInfoProps {
  regNr: string;
  vehicleTypeName: string;
  lastScan: string;
}

export async function VehicleInfoCard({
  regNr,
  vehicleTypeName,
  lastScan,
}: VehicleInfoProps) {
  return (
    <>
      <Card className="rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Vehicle Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg. Nr</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Last scan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{regNr}</TableCell>
                <TableCell>{vehicleTypeName}</TableCell>
                <TableCell>{lastScan}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
