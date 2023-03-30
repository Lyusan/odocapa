import React from 'react';
import { InputOnChange } from '../../type/Input';

const DEFAULT_CSS = 'block px-3 py-2 rounded-md bg-slate-100 placeholder:text-gray-400';

interface TextInputProp {
  id: string;
  type?: 'text' | 'number' | 'password' | 'textarea';
  placeholder?: string;
  name: string;
  value: any;
  onChange: InputOnChange;
}

export default function TextInput({ id, type, placeholder, name, value, onChange }: TextInputProp) {
  switch (type) {
    case 'textarea':
      return (
        <textarea
          className={`${DEFAULT_CSS} h-36`}
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.name, event.target.value)}
        />
      );
    case 'text':
    case 'number':
    case 'password':
      return (
        <input
          className={DEFAULT_CSS}
          type={type}
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.name, event.target.value)}
        />
      );
    default:
      return <div className="text-red-500">Type is not supported</div>;
  }
}

TextInput.defaultProps = { type: 'text', placeholder: '' };
