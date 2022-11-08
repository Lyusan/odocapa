import classNames from 'classnames';
import React from 'react';

interface ButtonProp {
  color?: string;
  textColor?: string;
  size?: 's' | 'md' | 'lg';
  text: string;
  onClick: () => void;
}

const defaultProps = {
  size: 'md',
  color: 'bg-slate-100',
  textColor: 'text-black',
};
export default function Button({ color, text, textColor, size, onClick }: ButtonProp) {
  let sizeClass;
  switch (size) {
    case 's':
      sizeClass = 'px-1 py-0';
      break;
    case 'lg':
      sizeClass = 'px-6 py-2';
      break;
    case 'md':
    default:
      sizeClass = 'px-3 py-1';
  }
  return (
    <button
      className={classNames('block rounded-md', sizeClass, color, textColor)}
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

Button.defaultProps = defaultProps;
