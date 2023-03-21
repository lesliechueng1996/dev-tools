import ToolGrid from '@/components/ToolGrid';
import { toolList } from '@/data';

export default function Home() {
  return (
    <div>
      <ToolGrid title="All tools" tools={toolList} />
    </div>
  );
}
