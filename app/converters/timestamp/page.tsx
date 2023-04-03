'use client';

import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import objectSupprot from 'dayjs/plugin/objectSupport';
import timezones from '@/timezones.json';
import { useEffect, useRef, useState } from 'react';
import {
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import NumberInput from '@/components/NumberInput';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(objectSupprot);

type DataType = {
  offset: string;
  isDST: boolean;
  localDateAndTime: string;
  utcDateAndTime: string;
  timestamp: number;
  time: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
};

const getOffset = (timezone: string) => {
  const item = timezones.find((item) => item.name === timezone);
  if (item) {
    const offset = item.timezone.replace('UTC', '');
    return offset || '+00:00';
  }
};

const judgeDST = (timezone: string, offset: string) => {
  return dayjs().tz(timezone).format('Z') !== offset;
};

const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getMaxDay = (year: number, month: number) => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else {
    return 31;
  }
};

function TimestampPage() {
  const createData = (dateTime: Dayjs, timezone?: string) => {
    let temp = dateTime;
    let isDST = false;
    let offset = '';
    if (timezone) {
      temp = dateTime.tz(timezone);
      offset = getOffset(timezone) ?? '';
      isDST = judgeDST(timezone, offset);
    }

    return {
      offset,
      isDST,
      localDateAndTime: temp.format('YYYY-MM-DD HH:mm:ss'),
      utcDateAndTime: temp.utc().format('YYYY-MM-DD HH:mm:ss'),
      timestamp: temp.unix(),
      time: {
        year: temp.year(),
        month: temp.month(),
        day: temp.day(),
        hour: temp.hour(),
        minute: temp.minute(),
        second: temp.second(),
      },
    };
  };

  const [chooseTimezone, setChooseTimezone] = useState(() => {
    const timezoneName = dayjs.tz.guess();
    const timezone = timezones.find(
      (timezone) => timezone.name === timezoneName
    );
    if (timezone) {
      return timezone.name;
    }
    return 'Etc/GMT';
  });

  const [data, setData] = useState<DataType>(() => {
    return createData(dayjs(), chooseTimezone);
  });

  const canTimestampUpdateRef = useRef(false);
  const canTimeUpdateRef = useRef(false);

  useEffect(() => {
    const offset = getOffset(chooseTimezone) ?? '';
    setData({
      ...data,
      offset,
      isDST: judgeDST(chooseTimezone, offset),
    });
  }, [chooseTimezone]);

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        setData({
          ...data,
          timestamp: Number(text),
        });
      });
    }
  };

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(data.timestamp.toString());
    }
  };

  useEffect(() => {
    console.log('timestamp');
    if (canTimeUpdateRef.current) {
      const setTime = dayjs.unix(data.timestamp);
      const temp = createData(setTime, chooseTimezone);
      setData({
        ...temp,
        timestamp: data.timestamp,
      });
    }
    canTimeUpdateRef.current = false;
  }, [data.timestamp]);

  useEffect(() => {
    console.log('time');
    if (canTimestampUpdateRef.current) {
      const setTime = dayjs(data.time);
      const temp = createData(setTime, chooseTimezone);
      setData({
        ...temp,
        time: data.time,
      });
    }
    canTimestampUpdateRef.current = false;
  }, [data.time]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Unix Timestamp Converter</h1>

      <div className="space-y-3">
        <h2>Time zone</h2>

        <div className="px-3 py-2 shadow border rounded-md bg-white">
          <select
            className="w-full"
            value={chooseTimezone}
            onChange={(e) => setChooseTimezone(e.target.value)}
          >
            {timezones.map((option, index) => (
              <option key={index} value={option.name}>
                ({option.timezone}) {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 bg-white border shadow rounded-md p-5 gap-3">
          <span>Offset</span>
          <span>{data.offset}</span>
          <span>Daylight saving time</span>
          <span>{data.isDST ? 'YES' : 'NO'}</span>
          <span>Local Date and Time</span>
          <span suppressHydrationWarning>{data.localDateAndTime}</span>
          <span>UTC Date and Time</span>
          <span suppressHydrationWarning>{data.utcDateAndTime}</span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2>Timestamp</h2>
            <div className="flex gap-3">
              <button
                className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
                onClick={() => setData(createData(dayjs(), chooseTimezone))}
              >
                Now
              </button>
              <button
                className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
                title="Paste"
                onClick={readClipboard}
              >
                <ClipboardDocumentCheckIcon className="w-6 h-6" />
                Paste
              </button>
              <button
                className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
                title="Copy"
                onClick={writeClipboard}
              >
                <DocumentDuplicateIcon className="w-6 h-6" />
                Copy
              </button>
            </div>
          </div>
          <div>
            <input
              className="w-full outline-none py-1 px-2 rounded-sm shadow border"
              type="number"
              min={0}
              value={data.timestamp}
              step={1}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (Number.isInteger(num) && num >= 0) {
                  setData({
                    ...data,
                    timestamp: num,
                  });
                  canTimeUpdateRef.current = true;
                }
              }}
            />
          </div>
        </div>

        <div className="flex -mx-2">
          <div className="flex-1">
            <NumberInput
              title="Year"
              value={data.time.year}
              min={0}
              max={9999}
              onValueChange={(year) => {
                const maxDay = getMaxDay(year, data.time.month);
                let day = data.time.day;
                if (data.time.day > maxDay) {
                  day = maxDay;
                }
                setData({
                  ...data,
                  time: {
                    ...data.time,
                    year,
                    day,
                  },
                });
                canTimestampUpdateRef.current = true;
              }}
            />
          </div>
          <div className="flex-1">
            <NumberInput
              title="Month"
              value={data.time.month}
              min={1}
              max={12}
              onValueChange={(month) => {
                const maxDay = getMaxDay(data.time.year, month);
                let day = data.time.day;
                if (data.time.day > maxDay) {
                  day = maxDay;
                }
                setData({
                  ...data,
                  time: {
                    ...data.time,
                    month,
                    day,
                  },
                });
                canTimestampUpdateRef.current = true;
              }}
            />
          </div>
          <div className="flex-1">
            <NumberInput
              title="Day"
              value={data.time.day}
              min={1}
              max={getMaxDay(data.time.year, data.time.month)}
              onValueChange={(day) => {
                setData({
                  ...data,
                  time: {
                    ...data.time,
                    day,
                  },
                });
                canTimestampUpdateRef.current = true;
              }}
            />
          </div>
          <div className="flex-1">
            <NumberInput
              title="Hour (24 hour)"
              value={data.time.hour}
              min={0}
              max={23}
              onValueChange={(hour) => {
                setData({
                  ...data,
                  time: {
                    ...data.time,
                    hour,
                  },
                });
                canTimestampUpdateRef.current = true;
              }}
            />
          </div>
          <div className="flex-1">
            <NumberInput
              title="Minutes"
              value={data.time.minute}
              min={0}
              max={59}
              onValueChange={(minute) => {
                setData({
                  ...data,
                  time: {
                    ...data.time,
                    minute,
                  },
                });
                canTimestampUpdateRef.current = true;
              }}
            />
          </div>
          <div className="flex-1">
            <NumberInput
              title="Seconds"
              value={data.time.second}
              min={0}
              max={59}
              onValueChange={(second) => {
                setData({
                  ...data,
                  time: {
                    ...data.time,
                    second,
                  },
                });
                canTimestampUpdateRef.current = true;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimestampPage;
