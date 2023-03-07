/* eslint-disable no-nested-ternary */
import React from 'react';
import ClosingButton from './ClosingButton';

interface StreetCardProp {
  title: string;
  child: any;
  onClose: () => void;
}

export default function SideCard({ title, child, onClose }: StreetCardProp) {
  return (
    <div className="grid grid-rows-card p-2 relative h-full">
      <h1 className="pb-4 text-2xl text-center text-main-blue">
        {title}
        <div className="absolute right-2 top-2">
          <ClosingButton onClose={onClose} />
        </div>
      </h1>

      {child}
    </div>
  );
}
