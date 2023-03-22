'use client';

import ToolGrid from '@/components/ToolGrid';
import { filterData } from '@/data';

const label = 'Graphic';
const data = filterData(label);

function GraphicPage() {
  return (
    <div>
      <ToolGrid title={label} tools={data} />
    </div>
  );
}

export default GraphicPage;
