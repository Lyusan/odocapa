import React from 'react';
import ClosingButton from './ClosingButton';

export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: any;
  onClose: () => void;
}) {
  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full bg-gray-700/60"
    >
      <div className="relative w-full max-w-6xl h-full md:h-auto m-auto">
        <div className="relative bg-white rounded-lg shadow  max-h-[600px] flex flex-col h-full">
          <div className="flex justify-between items-start p-4 rounded-t border-b ">
            <h3 className="text-xl font-semibold text-gray-900 ">{title}</h3>
            <ClosingButton onClose={onClose} />
          </div>
          <div className="h-full overflow-auto">
            <div className="m-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
