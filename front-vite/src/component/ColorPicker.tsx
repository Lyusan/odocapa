import classNames from 'classnames';
import React from 'react';

interface ColorPickerProps {
  size: number;
  color?: string;
  shape?: 'circle' | 'square';
  scale?: 'full' | 'half';
  selected?: boolean;
}

export default function ColorPicker({ color, size, shape, scale, selected }: ColorPickerProps) {
  return (
    <div
      className={classNames('bg-slate-200', {
        'rounded-full': shape === 'circle',
      })}
      style={{ width: size, height: size }}
    >
      <div
        className={classNames('w-full h-full transition-transform duration-300', {
          'scale-[0.50]': !selected || scale === 'half',
          'rounded-full': shape === 'circle',
        })}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

ColorPicker.defaultProps = {
  scale: 'full',
  shape: 'circle',
  color: '#322783',
  selected: true,
};
