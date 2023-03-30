import NumberInput from './NumberInput';

export type JwtDateTimeType = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

type Props = {
  value: JwtDateTimeType;
  onValueChange: (value: JwtDateTimeType) => void;
  className?: string;
};

function PasteInput({ value, onValueChange, className = '' }: Props) {
  return (
    <div className={`${className}`}>
      <div className="px-3 py-2 flex">
        <div className="flex-1">
          <NumberInput
            title="Expire in year(s)"
            value={value.year}
            min={0}
            max={9999}
            onValueChange={(year) =>
              onValueChange({
                ...value,
                year,
              })
            }
          />
        </div>
        <div className="flex-1">
          <NumberInput
            title="Expire in month(s)"
            value={value.month}
            min={0}
            max={12}
            onValueChange={(month) =>
              onValueChange({
                ...value,
                month,
              })
            }
          />
        </div>
        <div className="flex-1">
          <NumberInput
            title="Expire in day(s)"
            value={value.day}
            min={0}
            max={31}
            onValueChange={(day) =>
              onValueChange({
                ...value,
                day,
              })
            }
          />
        </div>
        <div className="flex-1">
          <NumberInput
            title="Expire in hour(s)"
            value={value.hour}
            min={0}
            max={24}
            onValueChange={(hour) =>
              onValueChange({
                ...value,
                hour,
              })
            }
          />
        </div>
        <div className="flex-1">
          <NumberInput
            title="Expire in minute(s)"
            value={value.minute}
            min={0}
            max={60}
            onValueChange={(minute) =>
              onValueChange({
                ...value,
                minute,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PasteInput;
