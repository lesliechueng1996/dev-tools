'use client';

import ToolGrid from '@/components/ToolGrid';
import { filterData } from '@/data';

const label = 'Text';
const data = filterData(label);

function TextPage() {
  return (
    <div>
      <ToolGrid title={label} tools={data} />
    </div>
  );
}

export default TextPage;
