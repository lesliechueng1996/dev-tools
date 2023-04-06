import Switch from 'react-switch';

type Props = {
  Icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
  >;
  value: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  subTitle?: string;
  trueValue: string;
  falseValue: string;
};

function SwitchSetting({
  Icon,
  value,
  onChange,
  title,
  subTitle,
  trueValue,
  falseValue,
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
      <div>{value ? trueValue : falseValue}</div>
      <div>
        <Switch
          checked={value}
          onChange={(checked) => {
            onChange(checked);
          }}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#0369A1"
        />
      </div>
    </div>
  );
}

export default SwitchSetting;
