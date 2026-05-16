import useAutocomplete from "../hooks/useAutocomplete";

const baseInputClasses =
  "bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 w-full outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition";

const AutocompleteInput = ({ value, onChange, placeholder }) => {
  const {
    suggestions,
    isOpen,
    activeIndex,
    setActiveIndex,
    selectSuggestion,
    inputHandlers
  } = useAutocomplete(value, onChange);

  return (
    <div className="relative">
      <input
        className={baseInputClasses}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        {...inputHandlers}
      />

      {isOpen && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion._id}
              type="button"
              className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                activeIndex === index
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={() => selectSuggestion(suggestion)}
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default AutocompleteInput;
