'use client';

import {
  ArrowsRightLeftIcon,
  BarsArrowDownIcon,
  LanguageIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import parser from 'cron-parser';
import dayjs from 'dayjs';
import TipBlock from '@/components/TipBlock';

const options = [5, 10, 25, 50, 100];

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

function CronParsePage() {
  const [includeSeconds, setIncludeSeconds] = useState(true);
  const [nextCount, setNextCount] = useState(options[0]);
  const [format, setFormat] = useState(defaultFormat);
  const [cron, setCron] = useState('* * * * * *');
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const cronRef = useRef<parser.CronExpression>();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    cronRef.current = parser.parseExpression(cron);
    let result = [];
    for (let i = 0; i < nextCount; i++) {
      result.push(dayjs(cronRef.current.next().toDate()).format(format));
    }
    outputRef.current!.value = result.join('\n');
  }, []);

  const readClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      navigator.clipboard.readText().then((text) => {
        setCron(text);
      });
    }
  };

  const writeClipboard = () => {
    const text = outputRef.current?.value || '';
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(text);
    }
  };

  useEffect(() => {
    try {
      // Format

      if (cron === '') {
        setErrorMsg('');
        cronRef.current = undefined;
        return;
      }

      if (cron.trim().split(' ').length !== (includeSeconds ? 6 : 5)) {
        setErrorMsg('Cron expression is not valid');
        cronRef.current = undefined;
        return;
      }

      const instance = parser.parseExpression(cron);
      cronRef.current = instance;
      setErrorMsg('');

      let result = [];
      for (let i = 0; i < nextCount; i++) {
        result.push(dayjs(cronRef.current.next().toDate()).format(format));
      }
      outputRef.current!.value = result.join('\n');
    } catch (e) {
      setErrorMsg('Cron expression is not valid');
    }
  }, [cron, includeSeconds, nextCount, format]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Cron expression parser</h1>

      {errorMsg && <TipBlock type="warn" msg={errorMsg} />}

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <ArrowsRightLeftIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-start flex-1">
              <span className="text-lg">Cron Mode</span>
              <span className="text-xs">
                Choose whatever Cron expression should includes seconds in its
                definition.
              </span>
            </div>
            <div>
              {includeSeconds
                ? 'Seconds included (6 - segment Cron)'
                : 'Standard mode (5 - segment Cron)'}
            </div>
            <div>
              <Switch
                checked={includeSeconds}
                onChange={(checked) => {
                  setIncludeSeconds(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          </div>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <BarsArrowDownIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-start flex-1">
              <span className="text-lg">Next scheduled dates</span>
              <span className="text-xs">
                How many scheduled dates needs to be generated
              </span>
            </div>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={nextCount}
                onChange={(e) => setNextCount(Number(e.target.value))}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <LanguageIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-start flex-1">
              <span className="text-lg">Output format</span>
              <span className="text-xs">
                Date time format of upcoming dates
              </span>
            </div>
            <div className="flex gap-2 items-center border shadow rounded-md px-3">
              <input
                className="outline-none py-3 px-2"
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              />
              <button>
                <XMarkIcon
                  className="w-6 h-6"
                  onClick={() => {
                    setFormat(defaultFormat);
                  }}
                  title="Reset"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2>Cron expression to parse</h2>
          <button
            className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
            title="Paste"
            onClick={readClipboard}
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            Paste
          </button>
        </div>
        <input
          className="w-full outline-none px-3 py-2 border shadow rounded-md"
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2>Next scheduled dates</h2>
          <button
            className="bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow"
            title="Copy"
            onClick={writeClipboard}
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
            Copy
          </button>
        </div>
        <textarea
          className="w-full h-56 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          ref={outputRef}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default CronParsePage;
