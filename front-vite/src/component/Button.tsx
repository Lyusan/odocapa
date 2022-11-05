import classNames from 'classnames';
import React from 'react';

interface ButtonProp {
  color?: string;
  text: string;
  onClick: () => void;
}

const defaultProps = {
  color: 'bg-slate-100',
};
export default function Button({ color = 'bg-slate-100', text, onClick }: ButtonProp) {
  return (
    <button
      className={classNames('block px-3 py-1 rounded-md', color)}
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

Button.defaultProps = defaultProps;
