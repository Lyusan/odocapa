import React from 'react';

interface BaseSelectProps {
  value: string;
  name: string;
  values: string[];
  onChange: (name: string, value: string) => void;
}

function BaseSelect({ value = '', name, values, onChange }: BaseSelectProps) {
  return (
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.name, event.target.value)}
    >
      {values.map((v) => (
        <option value={v}>{v}</option>
      ))}
    </select>
  );
}

export default BaseSelect;
