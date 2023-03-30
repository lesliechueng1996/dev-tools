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
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { SwitchDateProp, SwitchValueProp } from '@/components/DropdownBox';
import TipBlock from '@/components/TipBlock';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import Editor, { OnMount } from '@monaco-editor/react';
import * as jose from 'jose';
import dayjs from 'dayjs';

type Settings = ShowHideSettingsProps['items'];
type Editor = Parameters<OnMount>[0];

const options: string[] = [
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
  const [hasExpirations, setHasExpirations] = useState<SwitchDateProp>({
    flagValue: false,
    textValue: {
      year: 0,
      month: 0,
      day: 0,
      hour: 1,
      minute: 0,
    },
  });
  const [hasDefaultTime, setHasDefaultTime] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '', // not use
  });

  // encoding token
  const tokenOutputRef = useRef<HTMLTextAreaElement>(null);
  const headerEncodeRef = useRef<Editor>(null);
  const payloadEncodeRef = useRef<Editor>(null);
  const [secretInput, setSecretInput] = useState('');

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
        const temp = JSON.parse(headerEncodeRef.current.getValue());
        headerEncodeRef.current.setValue(
          JSON.stringify(
            {
              ...temp,
              alg: value,
            },
            null,
            4
          )
        );
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
      icon: <LightBulbIcon className="w-6 h-6" />,
      hasItem: true,
      type: 'switch',
      subType: 'date',
      value: hasExpirations,
      onValueChange: (value) => {
        setHasExpirations(value as SwitchDateProp);
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

  const writeClipboard = () => {
    const clipboard = navigator.clipboard;
    if (clipboard) {
      clipboard.writeText(tokenOutputRef.current!.value);
    }
  };

  const handleHeaderEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false }, readOnly: !isEncode });
    headerEncodeRef.current = editor;

    headerEncodeRef.current.setValue(
      JSON.stringify(
        {
          alg: 'HS256',
          typ: 'JWT',
        },
        null,
        4
      )
    );
  };

  const handlePayloadEditorMount = (editor: Editor) => {
    editor.updateOptions({ minimap: { enabled: false }, readOnly: !isEncode });
    payloadEncodeRef.current = editor;
  };

  const encodeJwt = useCallback(async () => {
    let header, payload;
    try {
      header = JSON.parse(headerEncodeRef.current!.getValue());
      payload = JSON.parse(payloadEncodeRef.current!.getValue());
    } catch (e) {
      setErrorMsg('Invalid JSON header or payload');
      return;
    }
    if (hasIssuer.flagValue) {
      payload.iss = hasIssuer.textValue;
      payload.iat = Math.floor(Date.now() / 1000);
    }
    if (hasAudience.flagValue) {
      payload.aud = hasAudience.textValue;
    }
    if (hasExpirations.flagValue) {
      const { year, month, day, hour, minute } = hasExpirations.textValue;
      const exp = dayjs()
        .add(year, 'year')
        .add(month, 'month')
        .add(day, 'day')
        .add(hour, 'hour')
        .add(minute, 'minute')
        .unix();
      payload.exp = exp;
    }
    if (hasDefaultTime.flagValue) {
      payload.exp = Math.floor(Date.now() / 1000) + 60 * 60;
      payload.iat = Math.floor(Date.now() / 1000);
      payload.nbf = payload.iat;
    }
    try {
      if (algorithm.startsWith('HS')) {
        const secret = new TextEncoder().encode(secretInput);
        const jwt = new jose.SignJWT(payload).setProtectedHeader({
          alg: algorithm,
          typ: 'JWT',
        });
        const token = await jwt.sign(secret);
        tokenOutputRef.current!.value = token;
        setErrorMsg('');
      } else {
        const privateKey = await jose.importPKCS8(secretInput, algorithm);
        const jwt = new jose.SignJWT(payload).setProtectedHeader({
          alg: algorithm,
          typ: 'JWT',
        });
        const token = await jwt.sign(privateKey);
        tokenOutputRef.current!.value = token;
        setErrorMsg('');
      }
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message);
    }
  }, [
    secretInput,
    algorithm,
    hasIssuer,
    hasAudience,
    hasExpirations,
    hasDefaultTime,
  ]);

  useEffect(() => {
    encodeJwt();
  }, [encodeJwt]);

  return (
    <div className="space-y-5">
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

      {/* Encoding - Token */}
      {isEncode && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2>Token</h2>
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
            ref={tokenOutputRef}
            readOnly
            className="w-full h-24 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
          ></textarea>
        </div>
      )}

      {/* Header & Payload */}
      <div className="flex gap-3 w-full">
        <div className="flex-1">
          <PasteLoadClearBar
            title="Header"
            onValueChange={(value) => headerEncodeRef.current.setValue(value)}
          />
          <Editor
            height={200}
            language="json"
            onMount={handleHeaderEditorMount}
            onChange={() => encodeJwt()}
          />
        </div>
        <div className="flex-1">
          <PasteLoadClearBar
            title="Payload"
            onValueChange={(value) => payloadEncodeRef.current.setValue(value)}
          />
          <Editor
            height={200}
            language="json"
            onMount={handlePayloadEditorMount}
            onChange={() => encodeJwt()}
          />
        </div>
      </div>

      {/* Secret */}
      <div>
        <PasteLoadClearBar
          title={algorithm.startsWith('HS') ? 'Secret' : 'Private Key'}
          onValueChange={(value) => setSecretInput(value)}
        />
        <textarea
          placeholder={algorithm.startsWith('HS') ? '' : 'PKCS#8'}
          value={secretInput}
          onChange={(e) => setSecretInput(e.target.value)}
          className="w-full h-24 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
        ></textarea>
      </div>
    </div>
  );
}

export default JwtPage;
