'use client';

import PasteInput from '@/components/PasteInput';
import TipBlock from '@/components/TipBlock';
import { LanguageIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Switch from 'react-switch';

function NumberBasePage() {
  const [useFormat, setUseFormat] = useState(false);
  const [useAdvanced, setUseAdvanced] = useState(false);

  const [msg, setMsg] = useState('');

  const [hex, setHex] = useState('');
  const [dec, setDec] = useState('');
  const [oct, setOct] = useState('');
  const [bin, setBin] = useState('');

  const clearAll = () => {
    setHex('');
    setDec('');
    setOct('');
    setBin('');
    setMsg('');
  };

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

      <div className="-mx-3 ">
        <PasteInput
          needClear
          value={hex}
          onValueChange={(value) => {
            setHex(value.toUpperCase());
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
              setDec(num.toString());
              setOct(num.toString(8));
              setBin(num.toString(2));
              setMsg('');
            } catch (e: any) {
              setMsg(e.message);
            }
          }}
          title="Hexadecimal"
        />
        <PasteInput
          needClear
          value={dec}
          onValueChange={(value) => {
            setDec(value);
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
              setHex(num.toString(16).toUpperCase());
              setOct(num.toString(8));
              setBin(num.toString(2));
              setMsg('');
            } catch (e: any) {
              setMsg(e.message);
            }
          }}
          title="Decimal"
        />
        <PasteInput
          needClear
          value={oct}
          onValueChange={(value) => {
            setOct(value);
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
              setHex(num.toString(16).toUpperCase());
              setDec(num.toString(10));
              setBin(num.toString(2));
              setMsg('');
            } catch (e: any) {
              setMsg(e.message);
            }
          }}
          title="Octal"
        />
        <PasteInput
          needClear
          value={bin}
          onValueChange={(value) => {
            setBin(value);
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
              setHex(num.toString(16).toUpperCase());
              setDec(num.toString(10));
              setOct(num.toString(8));
              setMsg('');
            } catch (e: any) {
              setMsg(e.message);
            }
          }}
          title="Binary"
        />
      </div>
    </div>
  );
}

export default NumberBasePage;
