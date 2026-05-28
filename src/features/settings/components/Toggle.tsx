'use client';

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#059669]' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${checked ? 'translate-x-[24px]' : 'translate-x-0'}`} />
    </button>
  );
}
