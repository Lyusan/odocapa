import React from 'react';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';
import DateMomentAgo from './DateMomentAgo';
import { formatStreetName } from '../helper/street';

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
        ['border', 'min-h-10', 'p-1 px-4', 'rounded-2xl', 'cursor-pointer'],
        lastUpdateDate ? 'bg-main-blue' : 'bg-main-blue bg-opacity-40',
        {
          'bg-opacity-80': !selected,
        },
      )}
      onClick={onSelectStreet}
    >
      <b className="text-white text-sm">{formatStreetName(name)}</b>
      <p className="text-white text-sm">
        {lastUpdateDate ? (
          <>
            Last modification
            <DateMomentAgo date={lastUpdateDate} />
          </>
        ) : (
          'No data'
        )}
      </p>
    </div>
  );
}

export default StreetButton;
