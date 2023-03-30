import React from 'react';
import classNames from 'classnames';
import ColorPicker from './ColoredCheckAndRadio';

interface InputColoredCheckAndRadioProps {
  name: string;
  isSelected?: boolean;
  size?: 'md' | 'sm';
  color?: string;
  onSelect: () => void;
}

export default function InputColoredCheckAndRadio({
  name,
  color,
  size,
  isSelected,
  onSelect,
}: InputColoredCheckAndRadioProps) {
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

InputColoredCheckAndRadio.defaultProps = {
  isSelected: false,
  size: 'md',
  color: '#322783',
};
