import React from 'react';
import classNames from 'classnames';

interface ColoredCheckAndRadioProps {
  size: number;
  color?: string;
  shape?: 'circle' | 'square';
  scale?: 'full' | 'half';
  selected?: boolean;
}

export default function ColoredCheckAndRadio({
  color,
  size,
  shape,
  scale,
  selected,
}: ColoredCheckAndRadioProps) {
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

ColoredCheckAndRadio.defaultProps = {
  scale: 'full',
  shape: 'circle',
  color: '#322783',
  selected: true,
};
