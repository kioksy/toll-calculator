import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VehicleInfoPaymentLogProps {
  paymentLog: any;
}

export async function VehicleInfoPaymentLogCard({
  paymentLog,
}: VehicleInfoPaymentLogProps) {
  console.log('paymentLog', paymentLog);
  return (
    <>
      <Card className="rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader>
          <CardTitle className="tracking-tight text-sm font-bold">
            Payment Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentLog.map((log: any, i: any) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.value} SEK</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
