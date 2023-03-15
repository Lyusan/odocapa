import React from 'react';

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative ">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-main-blue∂"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="search"
        placeholder="Recherche une rue, une place..."
        className="w-full pl-10 pr-4 rounded-full border-2 border-main-blue shadow focus:outline-none focus:shadow-slate-200 duration-100 shadow-gray-100 text-base py-0.5 text-main-blue placeholder:text-main-blue placeholder:opacity-80"
      />
    </div>
  );
}
