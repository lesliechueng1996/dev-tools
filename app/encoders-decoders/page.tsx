import ToolGrid from '@/components/ToolGrid';
import { filterData } from '@/data';

const label = 'Encoders / Decoders';
const data = filterData(label);

function EncodersDecodersPage() {
  return (
    <div>
      <ToolGrid title={label} tools={data} />
    </div>
  );
}

export default EncodersDecodersPage;
