import React from 'react';

function ToolItem(tool: MenuItem) {
  return (
    <div>
      <div>
        <div>{React.createElement(tool.icon, { className: 'h-8 w-8' })}</div>
      </div>
      <div>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
    </div>
  );
}

export default ToolItem;
