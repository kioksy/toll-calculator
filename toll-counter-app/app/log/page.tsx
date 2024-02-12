import { PageHeading } from '@/components/page-heading';
import { TollLogTable } from '@/components/toll-log';

async function getData() {
  const today = new Date().toISOString();
  const res = await fetch(
    `http://localhost:3000/toll_registration_log?date=${today}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Log() {
  const tollRegistrationLog = await getData();
  return (
    <>
      <PageHeading title="Toll Log" />
      <TollLogTable tollLog={tollRegistrationLog} />
    </>
  );
}
