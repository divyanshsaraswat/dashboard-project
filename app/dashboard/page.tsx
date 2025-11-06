import { generateInitialDataset } from '@/lib/dataGenerator';
import { DataProvider } from '@/components/providers/DataProvider';
import { DashboardClient } from './ui';

export const dynamic = 'force-static';

export default async function DashboardPage() {
  const initialData = generateInitialDataset(10_000);
  return (
    <DataProvider initialData={initialData}>
      <DashboardClient />
    </DataProvider>
  );
}

