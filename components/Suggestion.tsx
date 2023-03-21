'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import SuggestionItem from './SuggestionItem';

type Props = {
  data: MenuItem[];
  searchFun: (data: MenuItem[], keyword: string) => SuggestionItem[];
  onChoose: (suggestion: SuggestionItem) => void;
  onSeeAll: (suggestion: SuggestionItem[]) => void;
};

function Suggestion({ data, searchFun, onChoose, onSeeAll }: Props) {
  const [searchText, setSearchText] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const realKeyword = useDebounce(searchText, 500);

  useEffect(() => {
    if (realKeyword) {
      const result = searchFun(data, realKeyword);
      setSuggestions(result);
      setIsLoading(false);
    }
  }, [realKeyword]);

  return (
    <div className="relative">
      <div className="bg-white dark:bg-slate-800 flex items-center rounded-md px-3 py-1 border-b-sky-600 dark:border-b-white/70 border-b-2">
        <input
          value={searchText}
          onChange={(e) => {
            if (!showSuggestion) {
              setShowSuggestion(true);
              setIsLoading(true);
            }
            setSearchText(e.target.value);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestion(false);
              setIsLoading(false);
            }, 300);
          }}
          type="text"
          className="outline-none w-full dark:placeholder:text-white/70 dark:text-white/70 dark:bg-slate-800 py-1"
          placeholder="Type to search for tools..."
        />
        {searchText && (
          <XMarkIcon
            className="h-4 w-4 dark:text-white/70 mr-3 cursor-pointer"
            onClick={() => {
              setSearchText('');
            }}
          />
        )}
        <MagnifyingGlassIcon
          className="h-4 w-4 dark:text-white/70 rotate-90 cursor-pointer"
          onClick={() => {
            showSuggestion && onSeeAll(suggestions);
          }}
        />
      </div>
      {showSuggestion && (
        <ul className="absolute z-10 max-h-60 bg-white shadow rounded-md overflow-auto w-full">
          {isLoading ? (
            <SuggestionItem text="Loading..." />
          ) : suggestions.length == 0 ? (
            <SuggestionItem text="No results found" />
          ) : (
            suggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                keyword={realKeyword}
                text={suggestion.text}
                onClick={() => {
                  onChoose(suggestion);
                }}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default Suggestion;
