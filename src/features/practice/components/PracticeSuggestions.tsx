'use client';

interface Suggestion { topic: string; label: string; reason: string; icon: string; accent: string; difficulty: string; }

interface PracticeSuggestionsProps {
  suggestions: Suggestion[] | null;
  onSelectSuggestion: (item: Suggestion) => void;
}

export function PracticeSuggestions({ suggestions, onSelectSuggestion }: PracticeSuggestionsProps) {
  return (
    <section>
      <h2 className="text-base font-black text-gray-900 mb-4">Gợi ý ôn tập hôm nay</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions === null ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-50 rounded w-full" />
              </div>
            </div>
          ))
        ) : (
          suggestions.map((item) => (
            <button key={item.topic} onClick={() => onSelectSuggestion(item)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-left group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${item.accent}12` }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-800 group-hover:text-[#059669] transition-colors">{item.label}</p>
                <p className="text-[11px] text-gray-500 font-medium">{item.reason}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#059669] group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
