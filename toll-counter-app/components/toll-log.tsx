import { TollLog } from '@/types/tollog';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TollLogTableProps {
  tollLog: TollLog[];
}

export function TollLogTable({ tollLog }: TollLogTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration Number</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Registered At</TableHead>
            <TableHead>Registered Price</TableHead>
            <TableHead>Registration Tag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tollLog?.map((tollRow: TollLog, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Link
                  className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  href={'/vehicle-info/' + tollRow.regNr}
                >
                  {tollRow.regNr.toUpperCase()}
                </Link>
              </TableCell>
              <TableCell>{tollRow.vehicleTypeName}</TableCell>
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
    </>
  );
}
