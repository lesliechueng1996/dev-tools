'use client';

import { useSearchParams } from 'next/navigation';
import { filterDataByIds } from '@/data';
import ToolGrid from '@/components/ToolGrid';

function SearchPage() {
  const searchParams = useSearchParams();

  const ids = searchParams.getAll('id');
  const data = filterDataByIds(ids);

  return (
    <div>
      <ToolGrid title="Search Results" tools={data} />
    </div>
  );
}

export default SearchPage;
