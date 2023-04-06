type Props = {
  Icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
  >;
  value: string;
  onChange: (value: string) => void;
  title: string;
  subTitle?: string;
  options?: string[];
  optionValueFormatter?: (value: string) => string;
  keyValueOptions?: { key: string; value: string }[];
};

function SelectSetting({
  Icon,
  value,
  onChange,
  title,
  subTitle,
  options,
  optionValueFormatter,
  keyValueOptions,
}: Props) {
  return (
    <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
      <div>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col justify-start flex-1">
        <span className="text-lg">{title}</span>
        {subTitle && <span className="text-xs">{subTitle}</span>}
      </div>
      <div className="px-3 py-2 shadow border rounded-md">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options &&
            options.map((option) => (
              <option key={option} value={option}>
                {optionValueFormatter ? optionValueFormatter(option) : option}
              </option>
            ))}
          {keyValueOptions &&
            keyValueOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {optionValueFormatter
                  ? optionValueFormatter(option.value)
                  : option.value}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default SelectSetting;
