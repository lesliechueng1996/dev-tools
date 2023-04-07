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
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SwitchDateProp, SwitchValueProp } from '@/components/DropdownBox';
import TipBlock from '@/components/TipBlock';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import Editor, { OnMount } from '@monaco-editor/react';
import * as jose from 'jose';
import dayjs from 'dayjs';
import SwitchSetting from '@/components/SwitchSetting';
import CopyBar from '@/components/CopyBar';
import { useTheme } from '@/components/ThemeProvider';

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
  const { theme } = useTheme();

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

  // decoding properties
  const [validateIssuer, setValidateIssuer] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '',
  });
  const [validateAudience, setValidateAudience] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '',
  });
  const [validateLifetime, setValidateLifetime] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '', // not use
  });
  const [validateActor, setValidateActor] = useState<SwitchValueProp>({
    flagValue: false,
    textValue: '', // not use
  });

  // encoding token
  const tokenOutputRef = useRef<HTMLTextAreaElement>(null);
  const headerEncodeRef = useRef<Editor>(null);
  const payloadEncodeRef = useRef<Editor>(null);
  const [secretInput, setSecretInput] = useState('');

  // decoding token
  const [tokenInput, setTokenInput] = useState('');

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

  const decodeSettings: Settings = [
    {
      title: 'Validate issuer',
      subTitle: 'Valid issuers',
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      hasItem: true,
      type: 'switch',
      value: validateIssuer,
      onValueChange: (value) => {
        setValidateIssuer(value as SwitchValueProp);
      },
    },
    {
      title: 'Validate audience',
      subTitle: 'Valid audiences',
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      hasItem: true,
      type: 'switch',
      value: validateAudience,
      onValueChange: (value) => {
        setValidateAudience(value as SwitchValueProp);
      },
    },
    {
      title: 'Validate lifetime',
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      hasItem: false,
      type: 'switch',
      value: validateLifetime,
      onValueChange: (value) => {
        setValidateLifetime(value as SwitchValueProp);
      },
    },
    {
      title: 'Validate actor',
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      hasItem: false,
      type: 'switch',
      value: validateActor,
      onValueChange: (value) => {
        setValidateActor(value as SwitchValueProp);
      },
    },
  ];

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
    if (!isEncode) {
      return;
    }
    if (headerEncodeRef.current === null || payloadEncodeRef.current === null) {
      return;
    }

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
    isEncode,
  ]);

  const decodeJwt = useCallback(async () => {
    if (isEncode || !tokenInput) {
      return;
    }
    const jwt = tokenInput;
    try {
      const protectedHeader = jose.decodeProtectedHeader(jwt);
      const payload = jose.decodeJwt(jwt);
      headerEncodeRef.current!.setValue(
        JSON.stringify(protectedHeader, null, 4)
      );
      payloadEncodeRef.current!.setValue(JSON.stringify(payload, null, 4));

      if (needValidate) {
        // validate secret
        if (!protectedHeader.alg) {
          setErrorMsg('Invalid JWT');
          return;
        }
        if (protectedHeader.alg.startsWith('HS')) {
          const secret = new TextEncoder().encode(secretInput);
          const jwt = new jose.SignJWT(payload).setProtectedHeader({
            alg: protectedHeader.alg,
            typ: 'JWT',
          });
          const token = await jwt.sign(secret);
          if (token === tokenInput) {
            setErrorMsg('');
          } else {
            setErrorMsg('Invalid secret');
            return;
          }
        } else {
          const privateKey = await jose.importPKCS8(
            secretInput,
            protectedHeader.alg
          );
          const jwt = new jose.SignJWT(payload).setProtectedHeader({
            alg: protectedHeader.alg,
            typ: 'JWT',
          });
          const token = await jwt.sign(privateKey);
          if (token === tokenInput) {
            setErrorMsg('');
          } else {
            setErrorMsg('Invalid secret');
            return;
          }
        }

        // validate issuer
        if (validateIssuer.flagValue) {
          if (payload.iss !== validateIssuer.textValue) {
            setErrorMsg('Invalid issuer');
            return;
          }
        }

        // validate audience
        if (validateAudience.flagValue) {
          if (payload.aud !== validateAudience.textValue) {
            setErrorMsg('Invalid audience');
            return;
          }
        }

        // validate lifetime
        if (validateLifetime.flagValue) {
          const { exp, nbf } = payload;
          const now = Date.now() / 1000;
          if (!exp || !nbf || exp >= now || nbf <= now) {
            setErrorMsg('Invalid lifetime');
            return;
          }
        }

        // validate actor
        if (validateActor.flagValue) {
          if (!payload.act) {
            setErrorMsg('Invalid actor');
            return;
          }
        }
      }
      setErrorMsg('');
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message);
    }
  }, [
    tokenInput,
    isEncode,
    needValidate,
    secretInput,
    validateIssuer,
    validateAudience,
    validateLifetime,
    validateActor,
  ]);

  const setEncoderHeader = () => {
    headerEncodeRef.current?.setValue(
      JSON.stringify(
        {
          alg: algorithm,
          typ: 'JWT',
        },
        null,
        4
      )
    );
  };

  useEffect(() => {
    decodeJwt();
  }, [decodeJwt]);

  useEffect(() => {
    encodeJwt();
  }, [encodeJwt]);

  useEffect(() => {
    if (isEncode) {
      headerEncodeRef.current?.updateOptions({ readOnly: false });
      payloadEncodeRef.current?.updateOptions({ readOnly: false });
      setEncoderHeader();
    } else {
      headerEncodeRef.current?.updateOptions({ readOnly: true });
      payloadEncodeRef.current?.updateOptions({ readOnly: true });
    }
  }, [isEncode]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">JWT Encoder / Decoder</h1>

      <div>
        <h2>Configuration</h2>
        <div className="space-y-3">
          {/* Encode / Decode */}
          <SwitchSetting
            Icon={ArrowsRightLeftIcon}
            value={isEncode}
            onChange={(checked) => setIsEncode(checked)}
            title="Encode / Decode"
            trueValue="Encode"
            falseValue="Decode"
          />

          {!isEncode && (
            <SwitchSetting
              Icon={CheckCircleIcon}
              value={needValidate}
              onChange={(checked) => setNeedValidate(checked)}
              title="Validate Token"
              trueValue="Yes"
              falseValue="No"
            />
          )}

          {/* Token Validation */}
          {!isEncode && needValidate && (
            <div>
              <ShowHideSettings
                title="Token validation settings"
                subTitle="Select which token parameters to validate"
                items={decodeSettings}
              />
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
      </div>

      {/* Error Tip */}
      {errorMsg && <TipBlock type="error" msg={errorMsg} />}

      {/* Encoding - Token */}
      {isEncode && (
        <div>
          <CopyBar
            title="Token"
            getNeedCopyText={() => tokenOutputRef.current!.value}
          />
          <textarea
            ref={tokenOutputRef}
            readOnly
            className="w-full h-24 theme-bg theme-border resize-none outline-none p-3"
          ></textarea>
        </div>
      )}

      {/* Decoding - Token */}
      {!isEncode && (
        <div>
          <PasteLoadClearBar
            title="Token"
            onValueChange={(value) => setTokenInput(value)}
          />
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full h-24 theme-bg theme-border resize-none outline-none p-3"
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
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
          className="w-full h-24 theme-bg theme-border resize-none outline-none p-3"
        ></textarea>
      </div>
    </div>
  );
}

export default JwtPage;
