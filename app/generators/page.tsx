import ToolGrid from '@/components/ToolGrid';
import { filterData } from '@/data';

const label = 'Generators';
const data = filterData(label);

function GeneratorsPage() {
  return (
    <div>
      <ToolGrid title={label} tools={data} />
    </div>
  );
}

export default GeneratorsPage;
