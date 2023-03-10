import classNames from 'classnames';
import React from 'react';
import ColorPicker from './ColorPicker';

interface SelectProps {
  name: string;
  isSelected?: boolean;
  size?: 'md' | 'sm';
  color?: string;
  onSelect: () => void;
}

export default function Select({ name, color, size, isSelected, onSelect }: SelectProps) {
  return (
    <div
      className={classNames([
        'flex items-center cursor-pointer mb-0.5',

        {
          'text-sm': size === 'sm',
          'opacity-50': !isSelected,
        },
      ])}
      onClick={onSelect}
    >
      <ColorPicker
        color={color!}
        size={size === 'md' ? 20 : 13}
        selected={isSelected}
        shape="circle"
      />
      <div className="pl-2">{name}</div>
    </div>
  );
}

Select.defaultProps = {
  isSelected: false,
  size: 'md',
  color: '#322783',
};
