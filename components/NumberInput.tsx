type Props = {
  title: string;
  max: number;
  min: number;
  value: number;
  onValueChange: (value: number) => void;
};

function NumberInput({ title, max, min, value, onValueChange }: Props) {
  return (
    <div className="px-2">
      <h2>{title}</h2>
      <input
        className="w-full outline-none py-1 px-2 rounded-sm shadow border"
        type="number"
        min={min}
        max={max}
        value={value}
        step={1}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (Number.isInteger(num) && num >= min && num <= max) {
            onValueChange(num);
          }
        }}
      />
    </div>
  );
}

export default NumberInput;
