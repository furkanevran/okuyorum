import { useState } from "react";
import useConstant from 'use-constant'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import {useAsync} from 'react-async-hook'
/* thanks to: https://stackoverflow.com/a/28046731 */
export const useDebouncedSearch = (searchFunction) => {
    const [inputText, setInputText] = useState('');

    const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

    const searchResults = useAsync(
    async () => {
      if (inputText.length < 3) {
        return [];
      } else {
        return debouncedSearchFunction(inputText);
      }
    },
    [debouncedSearchFunction, inputText]
  );

    return {
    inputText,
    setInputText,
    searchResults,
  };
};