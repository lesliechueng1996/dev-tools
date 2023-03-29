'use client';

import ShowHideSettings, {
  Props as ShowHideSettingsProps,
} from '@/components/ShowHideSettings';
import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  FingerPrintIcon,
  LightBulbIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import Switch from 'react-switch';
import { SwitchValueProp } from '@/components/DropdownBox';
import TipBlock from '@/components/TipBlock';

type Settings = ShowHideSettingsProps['items'];

const options = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
];

function JwtPage() {
  const [isEncode, setIsEncode] = useState(true);
  const [needValidate, setNeedValidate] = useState(false);

  // encoding properties
  const [algorithm, setAlgorithm] = useState(options[0]);
  const [hasIssuer, setHasIssuer] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '',
  });
  const [hasAudience, setHasAudience] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '',
  });
  const [hasExpirations, setHasExpirations] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '',
  });
  const [hasDefaultTime, setHasDefaultTime] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '', // not use
  });
  const [errorMsg, setErrorMsg] = useState('');

  const encodeSettings: Settings = [
    {
      title: 'Token hashing algorithm',
      icon: <FingerPrintIcon className="w-6 h-6" />,
      hasItem: false,
      type: 'select',
      options,
      value: algorithm,
      onValueChange: (value) => {
        setAlgorithm(value as string);
      },
    },
    {
      title: 'Token has issuer',
      subTitle: 'Valid issuer',
      icon: <LightBulbIcon className="w-6 h-6" />,
      hasItem: true,
      type: 'switch',
      value: hasIssuer,
      onValueChange: (value) => {
        setHasIssuer(value as SwitchValueProp);
      },
    },
    {
      title: 'Token has audience',
      subTitle: 'Valid audience',
      icon: <LightBulbIcon className="w-6 h-6" />,
      hasItem: true,
      type: 'switch',
      value: hasAudience,
      onValueChange: (value) => {
        setHasAudience(value as SwitchValueProp);
      },
    },
    {
      title: 'Token has expirations',
      subTitle: 'Valid audience',
      icon: <LightBulbIcon className="w-6 h-6" />,
      hasItem: true,
      type: 'switch',
      value: hasExpirations,
      onValueChange: (value) => {
        setHasExpirations(value as SwitchValueProp);
      },
    },
    {
      title: 'Token has default time',
      icon: <ClockIcon className="w-6 h-6" />,
      hasItem: false,
      type: 'switch',
      value: hasDefaultTime,
      onValueChange: (value) => {
        setHasDefaultTime(value as SwitchValueProp);
      },
    },
  ];

  return (
    <div className="min-h-full flex flex-col gap-5">
      <h1 className="text-3xl">JWT Encoder / Decoder</h1>

      <div>
        <h2>Configuration</h2>

        {/* Encode / Decode */}
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
        {!isEncode && (
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
        )}

        {/* Settings */}
        {isEncode && (
          <div>
            <ShowHideSettings
              title="Settings"
              subTitle="Select token parameters"
              items={encodeSettings}
            />
          </div>
        )}
      </div>

      {/* Error Tip */}
      {errorMsg && <TipBlock type="error" msg={errorMsg} />}
    </div>
  );
}

export default JwtPage;
