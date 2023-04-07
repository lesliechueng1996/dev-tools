'use client';

import useDebounce from '@/hooks/useDebounce';
import {
  LanguageIcon,
  AdjustmentsHorizontalIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import HAMC_MD5 from 'crypto-js/hmac-md5';
import HAMC_SHA1 from 'crypto-js/hmac-sha1';
import HAMC_SHA256 from 'crypto-js/hmac-sha256';
import HAMC_SHA512 from 'crypto-js/hmac-sha512';
import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';
import HEX from 'crypto-js/enc-hex';
import BASE64 from 'crypto-js/enc-base64';
import SwitchSetting from '@/components/SwitchSetting';
import SelectSetting from '@/components/SelectSetting';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import CopyInput from '@/components/CopyInput';

const options = ['Hex', 'Base64'];

const getEncodeHelper = (type: string) => {
  if (type === 'Hex') {
    return HEX;
  }
  return BASE64;
};

function HashPage() {
  const [isUppercase, setIsUppercase] = useState(false);
  const [outputType, setOutputType] = useState(options[0]);
  const [useHMAC, setUseHMAC] = useState(false);
  const [input, setInput] = useState('');

  const [secret, setSecret] = useState('');
  const inputSecretFileRef = useRef<HTMLInputElement>(null);

  const [md5, setMd5] = useState('');
  const [sha1, setSha1] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');

  const realInput = useDebounce(input, 500);
  const realSecret = useDebounce(secret, 500);

  useEffect(() => {
    const encodeHelper = getEncodeHelper(outputType);
    if (!realInput) {
      return;
    }
    if (!useHMAC) {
      const md5Value = encodeHelper.stringify(MD5(realInput));
      const sha1Value = encodeHelper.stringify(SHA1(realInput));
      const sha256Value = encodeHelper.stringify(SHA256(realInput));
      const sha512Value = encodeHelper.stringify(SHA512(realInput));

      setMd5(isUppercase ? md5Value.toUpperCase() : md5Value.toLowerCase());
      setSha1(isUppercase ? sha1Value.toUpperCase() : sha1Value.toLowerCase());
      setSha256(
        isUppercase ? sha256Value.toUpperCase() : sha256Value.toLowerCase()
      );
      setSha512(
        isUppercase ? sha512Value.toUpperCase() : sha512Value.toLowerCase()
      );
    } else {
      const md5Value = encodeHelper.stringify(HAMC_MD5(realInput, realSecret));
      const sha1Value = encodeHelper.stringify(
        HAMC_SHA1(realInput, realSecret)
      );
      const sha256Value = encodeHelper.stringify(
        HAMC_SHA256(realInput, realSecret)
      );
      const sha512Value = encodeHelper.stringify(
        HAMC_SHA512(realInput, realSecret)
      );

      setMd5(isUppercase ? md5Value.toUpperCase() : md5Value.toLowerCase());
      setSha1(isUppercase ? sha1Value.toUpperCase() : sha1Value.toLowerCase());
      setSha256(
        isUppercase ? sha256Value.toUpperCase() : sha256Value.toLowerCase()
      );
      setSha512(
        isUppercase ? sha512Value.toUpperCase() : sha512Value.toLowerCase()
      );
    }
  }, [realInput, outputType, isUppercase, useHMAC, realSecret]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Hash Generator</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          <SwitchSetting
            Icon={LanguageIcon}
            value={isUppercase}
            onChange={(checked) => setIsUppercase(checked)}
            title="Uppercase"
            trueValue="On"
            falseValue="Off"
          />

          <SelectSetting
            Icon={AdjustmentsHorizontalIcon}
            value={outputType}
            onChange={(value) => setOutputType(value)}
            title="Output Type"
            options={options}
          />

          <SwitchSetting
            Icon={InboxIcon}
            value={useHMAC}
            onChange={(checked) => setUseHMAC(checked)}
            title="HMAC Mode"
            trueValue="On"
            falseValue="Off"
          />
        </div>
      </div>

      <div>
        <PasteLoadClearBar
          title="Input"
          onValueChange={(value) => setInput(value)}
        />
        <textarea
          className="w-full h-56 theme-bg theme-border resize-none outline-none p-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      {useHMAC && (
        <div>
          <PasteLoadClearBar
            title="Secret Key"
            onValueChange={(value) => setSecret(value)}
          />
          <textarea
            className="w-full h-56 theme-bg theme-border resize-none outline-none p-3"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          ></textarea>
        </div>
      )}

      <CopyInput title="MD5" value={md5} />
      <CopyInput title="SHA1" value={sha1} />
      <CopyInput title="SHA256" value={sha256} />
      <CopyInput title="SHA512" value={sha512} />
    </div>
  );
}

export default HashPage;
