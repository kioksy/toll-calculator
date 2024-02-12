import { CardArea } from '@/components/card-area';
import { GroupedLogEntriesCard } from '@/components/dashboard/grouped-log-entries';
import { GroupedVehiclesCard } from '@/components/dashboard/grouped-vehicles-card';
import { TotalLogEntriesCard } from '@/components/dashboard/total-log-entries-card';
import { TotalRegisteredPriceCard } from '@/components/dashboard/total-registered-price-card';
import { TotalVehiclesCard } from '@/components/dashboard/total-vehicles-card';
import { PageHeading } from '@/components/page-heading';

export default async function Home() {
  return (
    <>
      <PageHeading title="Home" />
      <CardArea>
        <TotalVehiclesCard />
        <TotalLogEntriesCard />
        <TotalRegisteredPriceCard />
        <GroupedVehiclesCard />
        <GroupedLogEntriesCard />
      </CardArea>
    </>
  );
}
