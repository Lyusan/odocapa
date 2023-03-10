import React from 'react';

export default function NavigationControl({
  zoomIn,
  zoomOut,
}: {
  zoomIn: () => void;
  zoomOut: () => void;
}) {
  return (
    <>
      <div
        className="w-7 h-7 p-1 bg-white border-main-blue border-[1.5px] z-20 text-center whitespace-nowrap rounded-t-lg mb-1 font-bold text-sm cursor-pointer"
        onClick={zoomIn}
      >
        +
      </div>
      <div
        className="w-7 h-7 p-1 bg-white border-main-blue border-[1.5px] z-20 text-center whitespace-nowrap rounded-b-lg font-bold text-sm cursor-pointer"
        onClick={zoomOut}
      >
        -
      </div>
    </>
  );
}
