'use client';

import ToolGrid from '@/components/ToolGrid';
import { filterData } from '@/data';

const label = 'Formatters';
const data = filterData(label);

function FormattersPage() {
  return (
    <div>
      <ToolGrid title={label} tools={data} />
    </div>
  );
}

export default FormattersPage;
