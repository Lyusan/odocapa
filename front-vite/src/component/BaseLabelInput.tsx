import React from 'react';

interface BaseLabelInputProps {
  label: string;
  inputId: string;
  children: any;
  componentRightLabel?: any;
}

export default function BaseLabelInput({
  label,
  children,
  inputId,
  componentRightLabel,
}: BaseLabelInputProps) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-1">
        <label htmlFor={inputId}>{`${label} :`}</label>
        {componentRightLabel}
      </div>
      {children}
    </div>
  );
}

BaseLabelInput.defaultProps = { componentRightLabel: null };
