import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSuggestions, fetchSuggestions } from "../store/suggestionSlice";

const useAutocomplete = (value, onSelect) => {
  const dispatch = useDispatch();
  const suggestions = useSelector((state) => state.suggestions.items);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const query = value.trim();

    if (!query) {
      dispatch(clearSuggestions());
      setIsOpen(false);
      setActiveIndex(-1);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch(fetchSuggestions(query)).then((result) => {
        if (fetchSuggestions.fulfilled.match(result)) {
          setIsOpen(result.payload.length > 0);
          setActiveIndex(result.payload.length > 0 ? 0 : -1);
        }
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [dispatch, value]);

  const selectSuggestion = (suggestion) => {
    if (!suggestion) return;
    onSelect(suggestion.text);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const inputHandlers = useMemo(
    () => ({
      onKeyDown: (event) => {
        if (!isOpen || suggestions.length === 0) return;

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setActiveIndex((index) => (index + 1) % suggestions.length);
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
        }

        if (event.key === "Enter" && activeIndex >= 0) {
          event.preventDefault();
          selectSuggestion(suggestions[activeIndex]);
        }

        if (event.key === "Escape") {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      },
      onFocus: () => {
        if (suggestions.length > 0) setIsOpen(true);
      },
      onBlur: () => {
        window.setTimeout(() => setIsOpen(false), 120);
      }
    }),
    [activeIndex, isOpen, suggestions]
  );

  return {
    suggestions,
    isOpen,
    activeIndex,
    setIsOpen,
    setActiveIndex,
    selectSuggestion,
    inputHandlers
  };
};

export default useAutocomplete;
