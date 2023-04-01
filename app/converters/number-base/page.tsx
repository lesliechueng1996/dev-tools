'use client';

import PasteInput from '@/components/PasteInput';
import TipBlock from '@/components/TipBlock';
import {
  LanguageIcon,
  CubeTransparentIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { base16, base32, base32hex, base64, base64url } from 'rfc4648';

const dictionary = [
  'RFC-4648 Base16',
  'RFC-4648 Base32',
  'RFC-4648 Base32 Extended Hex',
  'RFC-4648 Base64',
  'RFC-4648 Base64 Url Encode',
];

function NumberBasePage() {
  const [useFormat, setUseFormat] = useState(false);
  const [useAdvanced, setUseAdvanced] = useState(false);

  const [msg, setMsg] = useState('');

  const [hex, setHex] = useState('');
  const [dec, setDec] = useState('');
  const [oct, setOct] = useState('');
  const [bin, setBin] = useState('');

  const [inputType, setInputType] = useState(dictionary[0]);
  const [outputType, setOutputType] = useState(dictionary[3]);

  const [advancedInput, setAdvancedInput] = useState('');
  const [advancedOutput, setAdnvancedOutput] = useState('');

  const clearAll = () => {
    setHex('');
    setDec('');
    setOct('');
    setBin('');
    setMsg('');
  };

  useEffect(() => {
    if (useFormat) {
      setHex(formatHex(hex));
      setDec(formatDec(dec));
      setOct(formatOct(oct));
      setBin(formatBin(bin));
    } else {
      setHex(hex.replace(/\s/g, ''));
      setDec(dec.replace(/,/g, ''));
      setOct(oct.replace(/\s/g, ''));
      setBin(bin.replace(/\s/g, ''));
    }
  }, [useFormat]);

  const formatNumber = (num: string, interval: number, char: string) => {
    if (!useFormat) {
      return num;
    }
    const arr = num.split('').reverse();
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (i % interval === 0 && i !== 0) {
        result.push(char);
      }
      result.push(arr[i]);
    }
    return result.reverse().join('');
  };

  const formatHex = (num: string) => formatNumber(num, 4, ' ');

  const formatDec = (num: string) => formatNumber(num, 3, ',');

  const formatOct = (num: string) => formatNumber(num, 3, ' ');

  const formatBin = (num: string) => formatNumber(num, 4, ' ');

  const convert = () => {
    const getHelperByType = (type: string) => {
      switch (type) {
        case dictionary[0]:
          return base16;
        case dictionary[1]:
          return base32;
        case dictionary[2]:
          return base32hex;
        case dictionary[3]:
          return base64;
        case dictionary[4]:
          return base64url;
        default:
          return base16;
      }
    };

    const inputHelper = getHelperByType(inputType);
    const outputHelper = getHelperByType(outputType);

    try {
      const decoded = inputHelper.parse(advancedInput, {
        loose: true,
      });
      const encoded = outputHelper.stringify(decoded);
      if (useFormat) {
        setAdnvancedOutput(formatNumber(encoded, 4, ' '));
      } else {
        setAdnvancedOutput(encoded);
      }
      setMsg('');
    } catch (e: any) {
      setMsg(e.message);
    }
  };

  useEffect(() => {
    convert();
  }, [inputType, outputType, advancedInput, useFormat]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Number Base Converter</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <LanguageIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Format number</span>
            <div>{useFormat ? 'On' : 'Off'}</div>
            <div>
              <Switch
                checked={useFormat}
                onChange={(checked) => {
                  setUseFormat(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          </div>
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <CubeTransparentIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Advanced mode</span>
            <div>{useAdvanced ? 'On' : 'Off'}</div>
            <div>
              <Switch
                checked={useAdvanced}
                onChange={(checked) => {
                  setUseAdvanced(checked);
                }}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#0369A1"
              />
            </div>
          </div>
        </div>
      </div>

      {msg && <TipBlock type="warn" msg={msg} />}

      {!useAdvanced ? (
        <div className="-mx-3 ">
          <PasteInput
            needClear
            value={hex}
            onValueChange={(value) => {
              setHex(formatHex(value.toUpperCase()));
              if (value === '') {
                clearAll();
                return;
              }
              try {
                const num = parseInt(value, 16);
                if (Number.isNaN(num)) {
                  setMsg("The current value isn't a valid Hexadecimal");
                  return;
                }
                setDec(formatDec(num.toString()));
                setOct(formatOct(num.toString(8)));
                setBin(formatBin(num.toString(2)));
                setMsg('');
              } catch (e: any) {
                setMsg(e.message);
              }
            }}
            onBlur={(value) => {
              setHex(formatHex(value));
            }}
            onFocus={(value) => {
              setHex(value.replace(/ /g, '').toUpperCase());
            }}
            title="Hexadecimal"
          />
          <PasteInput
            needClear
            value={dec}
            onValueChange={(value) => {
              setDec(formatDec(value));
              if (value === '') {
                clearAll();
                return;
              }
              try {
                const num = parseInt(value, 10);
                if (Number.isNaN(num)) {
                  setMsg("The current value isn't a valid Decimal");
                  return;
                }
                setHex(formatHex(num.toString(16).toUpperCase()));
                setOct(formatOct(num.toString(8)));
                setBin(formatBin(num.toString(2)));
                setMsg('');
              } catch (e: any) {
                setMsg(e.message);
              }
            }}
            onBlur={(value) => {
              setDec(formatDec(value));
            }}
            onFocus={(value) => {
              setDec(value.replace(/,/g, '').toUpperCase());
            }}
            title="Decimal"
          />
          <PasteInput
            needClear
            value={oct}
            onValueChange={(value) => {
              setOct(formatOct(value));
              if (value === '') {
                clearAll();
                return;
              }
              try {
                const num = parseInt(value, 8);
                if (Number.isNaN(num)) {
                  setMsg("The current value isn't a valid Octal");
                  return;
                }
                setHex(formatHex(num.toString(16).toUpperCase()));
                setDec(formatDec(num.toString(10)));
                setBin(formatBin(num.toString(2)));
                setMsg('');
              } catch (e: any) {
                setMsg(e.message);
              }
            }}
            onBlur={(value) => {
              setOct(formatOct(value));
            }}
            onFocus={(value) => {
              setOct(value.replace(/ /g, '').toUpperCase());
            }}
            title="Octal"
          />
          <PasteInput
            needClear
            value={bin}
            onValueChange={(value) => {
              setBin(formatBin(value));
              if (value === '') {
                clearAll();
                return;
              }
              try {
                const num = parseInt(value, 2);
                if (Number.isNaN(num)) {
                  setMsg("The current value isn't a valid Binary");
                  return;
                }
                setHex(formatHex(num.toString(16).toUpperCase()));
                setDec(formatDec(num.toString(10)));
                setOct(formatOct(num.toString(8)));
                setMsg('');
              } catch (e: any) {
                setMsg(e.message);
              }
            }}
            onBlur={(value) => {
              setBin(formatBin(value));
            }}
            onFocus={(value) => {
              setBin(value.replace(/ /g, '').toUpperCase());
            }}
            title="Binary"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <ChevronRightIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Input dictionary</span>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
              >
                {dictionary.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <PasteInput
            title="Input"
            value={advancedInput}
            onValueChange={(value) => setAdvancedInput(value)}
            className="-mx-3"
          />

          <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20">
            <div>
              <ChevronLeftIcon className="w-6 h-6" />
            </div>
            <span className="flex-1">Output dictionary</span>
            <div className="px-3 py-2 shadow border rounded-md">
              <select
                value={outputType}
                onChange={(e) => setOutputType(e.target.value)}
              >
                {dictionary.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <h2>Output</h2>
            <div className="flex gap-3">
              <input
                className="w-full outline-none py-1 px-2 rounded-sm shadow border"
                type="text"
                value={advancedOutput}
                readOnly
              />
              <button
                className="bg-white rounded-md shadow border p-2"
                title="Copy"
              >
                <DocumentDuplicateIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NumberBasePage;
