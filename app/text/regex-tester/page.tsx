'use client';

import { SwitchValueProp } from '@/components/DropdownBox';
import PasteInput from '@/components/PasteInput';
import PasteLoadClearBar from '@/components/PasteLoadClearBar';
import ShowHideSettings from '@/components/ShowHideSettings';
import { useEffect, useState } from 'react';

type Options = Parameters<typeof ShowHideSettings>[0]['items'];
type MatchType = {
  index: number;
  startPos: number;
  endPos: number;
  text: string;
};

function RegexTester() {
  const [ignoreCase, setIgnoreCase] = useState({
    textValue: '',
    flagValue: false,
  });
  const [singleline, setSingleline] = useState({
    textValue: '',
    flagValue: false,
  });
  const [multiline, setMultiline] = useState({
    textValue: '',
    flagValue: false,
  });

  const [expression, setExpression] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<MatchType[]>([]);

  const options: Options = [
    {
      title: 'Ignore Case',
      description: 'Specifies case-insensitive matching.',
      value: ignoreCase,
      onValueChange: (value) => {
        setIgnoreCase(value as SwitchValueProp);
      },
      type: 'switch',
      icon: <></>,
      hasItem: false,
    },
    {
      title: 'Singleline',
      description:
        'Changes the meaning of the dot (.) so it matches every character (instead of every character except \n).',
      value: singleline,
      onValueChange: (value) => {
        setSingleline(value as SwitchValueProp);
      },
      type: 'switch',
      icon: <></>,
      hasItem: false,
    },
    {
      title: 'Multiline',
      description:
        'Changes the meaning of ^ and $ so they match at the beginning and end, respectively, of any line, and not just the beginning and end of the entire string.',
      value: multiline,
      onValueChange: (value) => {
        setMultiline(value as SwitchValueProp);
      },
      type: 'switch',
      icon: <></>,
      hasItem: false,
    },
  ];

  useEffect(() => {
    if (!text || !expression) {
      return;
    }
    let flag = 'g';
    if (ignoreCase.flagValue) {
      flag += 'i';
    }
    if (singleline.flagValue) {
      flag += 's';
    }
    if (multiline.flagValue) {
      flag += 'm';
    }
    try {
      const regex = new RegExp(expression, flag);
      let matches: MatchType[] = [];
      let counter = 0;
      if (regex.test(text) === false) {
        setMatches([]);
        return;
      }
      regex.lastIndex = 0;
      while (true) {
        const temp = regex.exec(text);
        console.log(temp);
        if (temp === null) {
          break;
        }
        matches.push({
          index: ++counter,
          startPos: temp.index,
          endPos: temp.index + temp[0].length,
          text: temp[0],
        });
      }
      setMatches(matches);
    } catch (e) {}
  }, [text, expression, ignoreCase, singleline, multiline]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Regex Text</h1>

      <div>
        <h2>Configuration</h2>
        <div>
          <ShowHideSettings title="Options" subTitle="" items={options} />
        </div>
      </div>

      <div>
        <PasteInput
          className="-mx-3"
          title="Regular expression"
          value={expression}
          onValueChange={(value) => setExpression(value)}
        />
      </div>

      <div>
        <PasteLoadClearBar
          title="Text"
          onValueChange={(value) => setText(value)}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-80 shadow border border-b-black/40 border-b-2 rounded-md resize-none outline-none p-3"
        ></textarea>
      </div>

      <div>
        <h2>Matches</h2>
        <div className="bg-white border shadow rounded-md min-h-[4rem] px-3 py-3">
          {matches.map((match) => (
            <div
              key={match.index}
              className="flex justify-between border shadow rounded-md h-14 items-center px-5"
            >
              <span>Match ${match.index}:</span>
              <span>
                {match.startPos}-{match.endPos}
              </span>
              <span>{match.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegexTester;
