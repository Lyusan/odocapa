import React from 'react';
import classNames from 'classnames';

interface StreetProps {
  name: string;
  selected: boolean;
  lastUpdateDate: string;
  onSelectStreet: () => void;
}

function StreetButton({ name, selected, lastUpdateDate, onSelectStreet }: StreetProps) {
  return (
    <div
      className={classNames(
        ['border', 'min-h-10', 'p-1', 'rounded-md', 'border-gray-600'],
        lastUpdateDate ? 'bg-blue-300' : 'bg-slate-300',
        {
          'bg-opacity-80': !selected,
        },
      )}
      onClick={onSelectStreet}
    >
      <b className="text-gray-800">{name}</b>
      <p className="text-gray-600">{lastUpdateDate}</p>
    </div>
  );
}

export default StreetButton;
