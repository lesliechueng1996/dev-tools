'use client';

import ToolGrid from '@/components/ToolGrid';
import { filterData } from '@/data';

const label = 'Converters';
const data = filterData(label);

function ConvertersPage() {
  return (
    <div>
      <ToolGrid title={label} tools={data} />
    </div>
  );
}

export default ConvertersPage;
