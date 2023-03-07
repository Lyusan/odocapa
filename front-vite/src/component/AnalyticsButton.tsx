import React from 'react';

export default function AnalyticsButton({ onAnalytics }: { onAnalytics: () => void }) {
  return (
    <button
      type="button"
      className="text-main-blue bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
      data-modal-toggle="defaultModal"
      onClick={onAnalytics}
    >
      <svg
        width="25"
        height="25"
        viewBox="0 0 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="127" width="52.161" height="123" rx="6" fill="#322783" />
        <rect x="194.113" y="78" width="55.8867" height="172" rx="6" fill="#322783" />
        <path
          d="M95.1938 6C95.1938 2.68629 97.8801 0 101.194 0H145.081C148.394 0 151.081 2.68629 151.081 6V244C151.081 247.314 148.394 250 145.081 250H101.194C97.8801 250 95.1938 247.314 95.1938 244V6Z"
          fill="#322783"
        />
      </svg>

      <span className="sr-only">Close</span>
    </button>
  );
}
