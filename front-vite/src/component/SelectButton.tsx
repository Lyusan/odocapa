import React from 'react';
import classNames from 'classnames';

interface SelectButtonProps {
  name: string;
  selected: boolean;
  minWidth?: string;
  onClick: () => void;
}

export default function SelectButton({ name, minWidth, selected, onClick }: SelectButtonProps) {
  return (
    <div
      className={classNames(
        'text-xs px-3.5 py-1 rounded-full select-none transition-opacity duration-500  bg-main-blue text-white text-center',
        {
          'font-normal opacity-60 cursor-pointer hover:opacity-100 ': !selected,
        },
      )}
      style={minWidth ? { minWidth } : {}}
      onClick={() => {
        if (!selected) onClick();
      }}
    >
      {name}
    </div>
  );
}

SelectButton.defaultProps = {
  minWidth: '',
};
