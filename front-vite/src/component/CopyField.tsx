import React from 'react';

interface CopyFieldProp {
  value: string;
  onClick: (value: string) => void;
}

function CopyField({ value, onClick }: CopyFieldProp) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className="w-1 h-1 rounded-full p-4 text-center bg-slate-600 text-white mr-4 flex justify-center items-center"
        onClick={() => {
          onClick(value);
        }}
      >
        <b>{'<'}</b>
      </button>
      <p className="border rounded-lg p-2 max-h-32 overflow-auto">{value}</p>
    </div>
  );
}

export default CopyField;
