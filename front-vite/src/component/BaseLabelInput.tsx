import React from 'react';

interface BaseLabelInputProps {
  label: string;
  inputId: string;
  children: any;
}

function BaseLabelInput({ label, children, inputId }: BaseLabelInputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-600" htmlFor={inputId}>
        {`${label}:`}
      </label>
      {children}
    </div>
  );
}

export default BaseLabelInput;
