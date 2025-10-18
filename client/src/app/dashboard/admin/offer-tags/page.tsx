import { getAllOfferTags } from '@/queries/offer-tag';

import DataTable from '@/components/ui/data-table';

import { Plus } from 'lucide-react';

import OfferTagDetails from '@/components/dashboard/forms/offer-tag-details';

import { columns } from './columns';

export default async function AdminOfferTagsPage() {
  // Fetching offer tags data from the database
  const categories = await getAllOfferTags();

  // Checking if no offer tags are found
  if (!categories) return null; 

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create offer tag
        </>
      }
      modalChildren={<OfferTagDetails />}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search offer tag name..."
      columns={columns}
    />
  );
}