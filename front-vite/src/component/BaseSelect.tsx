import React from 'react';

type Key = string | number;
type Value = { key: Key; displayName: string };

interface BaseSelectProps {
  value: Key | undefined | null;
  name: string;
  values: Value[] | string[];
  withNoOption?: boolean;
  onChange: (name: string, value: Key) => void;
}

export default function BaseSelect({
  value,
  name,
  values,
  withNoOption,
  onChange,
}: BaseSelectProps) {
  let newValues: Value[];
  if (typeof values?.[0] === 'string') {
    newValues = (values as string[]).map((v) => ({ key: v, displayName: v }));
  } else newValues = values as Value[];
  return (
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      name={name}
      value={value ?? undefined}
      onChange={(event) => onChange(event.target.name, event.target.value)}
    >
      {withNoOption ? <option value="">--Please choose an option--</option> : null}
      {newValues.map((v) => (
        <option key={v.key} value={v.key}>
          {v.displayName}
        </option>
      ))}
    </select>
  );
}

BaseSelect.defaultProps = { withNoOption: false };
