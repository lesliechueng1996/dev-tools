type Props = {
  type: 'AA' | 'AAA';
  size: 'large' | 'small';
  ratio: number;
  className?: string;
};

function ContrastRatio({ type, size, ratio, className = '' }: Props) {
  const isPass = () => {
    if (type === 'AA') {
      if (size === 'small') {
        return ratio >= 4.5;
      } else {
        return ratio >= 3;
      }
    } else {
      if (size === 'small') {
        return ratio >= 7;
      } else {
        return ratio >= 4.5;
      }
    }
  };

  return (
    <div
      className={`text-white ${
        isPass() ? 'bg-green-700' : 'bg-red-600'
      } rounded-md space-y-2 py-3 flex flex-col items-center ${className}`}
    >
      <span className="text-xs">
        {size === 'large' ? 'Large text' : 'Small text'}
      </span>
      <span className="text-xl">{`WCAG ${type}`}</span>
      <span className="text-xs">{isPass() ? 'Pass' : 'Fail'}</span>
    </div>
  );
}

export default ContrastRatio;
