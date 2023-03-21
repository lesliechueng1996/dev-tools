import ToolItem from './ToolItem';

type Props = {
  title: string;
  tools: MenuItem[];
};

function ToolGrid({ title, tools }: Props) {
  return (
    <div>
      {tools.length === 0 ? (
        <h1 className="text-3xl mb-5">No results found</h1>
      ) : (
        <>
          <h1 className="text-3xl mb-5">{title}</h1>
          <div className="flex flex-wrap gap-7 justify-around">
            {tools.map((tool) => (
              <ToolItem key={tool.id} tool={tool} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ToolGrid;
