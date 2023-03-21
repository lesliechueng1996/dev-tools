type Props = {
  text: string;
  keyword?: string;
  onClick?: () => void;
};

type HighlightText = {
  text: string;
  highlight: boolean;
};

const findAllIndex = (name: string, keyword: string) => {
  const lowerName = name.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  let result: number[] = [];
  let index = 0;
  do {
    index = lowerName.indexOf(lowerKeyword, index);
    if (index != -1) {
      result.push(index);
      index++;
    }
  } while (index != -1);
  return result;
};

function SuggestionItem({ text, onClick, keyword }: Props) {
  const SuggestionText = () => {
    if (!keyword) {
      return <span>{text}</span>;
    }

    const indexResult = findAllIndex(text, keyword);
    if (indexResult.length === 0) {
      return <span>{text}</span>;
    }

    const keywordLength = keyword.length;
    let temp: HighlightText[] = [];
    if (indexResult[0] !== 0) {
      temp.push({
        text: text.substring(0, indexResult[0]),
        highlight: false,
      });
    }
    for (let i = 0; i < indexResult.length; i++) {
      let startIndex = indexResult[i];
      let endIndex;
      if (i + 1 < indexResult.length) {
        endIndex = indexResult[i + 1];
      } else {
        endIndex = text.length;
      }
      temp.push({
        text: text.substring(startIndex, startIndex + keywordLength),
        highlight: true,
      });

      if (startIndex + keywordLength < endIndex) {
        temp.push({
          text: text.substring(startIndex + keywordLength, endIndex),
          highlight: false,
        });
      }
    }

    return (
      <>
        {temp.map((item, index) => (
          <span
            key={index}
            className={`${item.highlight && 'text-blue-500 font-bold'}`}
          >
            {item.text}
          </span>
        ))}
      </>
    );
  };

  return (
    <li
      className="h-10 px-3 py-1 flex items-center border-b last:border-none cursor-pointer hover:bg-gray-100"
      onClick={() => {
        onClick && onClick();
      }}
    >
      <SuggestionText />
    </li>
  );
}

export default SuggestionItem;
