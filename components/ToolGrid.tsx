import ToolItem from './ToolItem';

type Props = {
  title: string;
  tools: MenuItem[];
};

function ToolGrid({ title, tools }: Props) {
  return (
    <div className="p-10">
      <h1 className="text-3xl mb-5">{title}</h1>
      <div className="flex flex-wrap gap-7 justify-around">
        {tools.map((tool) => (
          <ToolItem tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default ToolGrid;
