import React from 'react';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';
import DateMomentAgo from './DateMomentAgo';

interface StreetProps {
  name: string;
  selected: boolean;
  lastUpdateDate: Timestamp | null;
  onSelectStreet: () => void;
}

function StreetButton({ name, selected, lastUpdateDate, onSelectStreet }: StreetProps) {
  return (
    <div
      className={classNames(
        ['border', 'min-h-10', 'p-1', 'rounded-md', 'border-gray-600', 'cursor-pointer'],
        lastUpdateDate ? 'bg-blue-300' : 'bg-slate-300',
        {
          'bg-opacity-80': !selected,
        },
      )}
      onClick={onSelectStreet}
    >
      <b className="text-gray-800">{name}</b>
      {lastUpdateDate ? (
        <p className="text-gray-600">
          <DateMomentAgo date={lastUpdateDate} />
        </p>
      ) : null}
    </div>
  );
}

export default StreetButton;
