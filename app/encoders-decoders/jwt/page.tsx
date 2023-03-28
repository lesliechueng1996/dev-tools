'use client';

import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import Switch from 'react-switch';

function JwtPage() {
  const [isEncode, setIsEncode] = useState(false);
  const [needValidate, setNeedValidate] = useState(false);

  return (
    <div className="min-h-full flex flex-col gap-5">
      <h1 className="text-3xl">JWT Encoder / Decoder</h1>

      <div>
        <h2>Configuration</h2>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20 mb-3">
          <div>
            <ArrowsRightLeftIcon className="w-6 h-6" />
          </div>
          <span className="flex-1">Encode / Decode</span>
          <div>{isEncode ? 'Encode' : 'Decode'}</div>
          <div>
            <Switch
              checked={isEncode}
              onChange={(checked) => {
                setIsEncode(checked);
              }}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#0369A1"
            />
          </div>
        </div>
        <div className="flex items-center bg-white py-5 px-5 rounded-md shadow gap-5 h-20 mb-3">
          <div>
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <span className="flex-1">Validate Token</span>
          <div>{needValidate ? 'Yes' : 'No'}</div>
          <div>
            <Switch
              checked={needValidate}
              onChange={(checked) => {
                setNeedValidate(checked);
              }}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#0369A1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JwtPage;
