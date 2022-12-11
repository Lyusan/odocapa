import React from 'react';
import { InputOnChange } from '../type/Input';

interface TextInputProp {
  id: string;
  type?: string;
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
          className="block px-3 py-2 h-36 rounded-md bg-slate-100 placeholder:text-gray-400"
          id={id}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.name, event.target.value)}
        />
      );
    case 'text':
    case 'number':
      return (
        <input
          className="block px-3 py-2  rounded-md bg-slate-100 placeholder:text-gray-400"
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
