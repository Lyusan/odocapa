import React from 'react';

export default function SearchingButton({ onClick, size }: { onClick: () => void; size?: number }) {
  return (
    <button
      type="button"
      className="bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-1.5 ml-auto inline-flex items-center"
      data-modal-toggle="defaultModal"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        className="text-main-blue"
        fill="none"
        stroke="currentColor"
        height={size}
        width={size}
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
      <span className="sr-only">Search</span>
    </button>
  );
}
SearchingButton.defaultProps = {
  size: 15,
};
