import React from 'react';

export default function ProgressBar({ max, value }: { max: number; value: number }) {
  return (
    <div className="bg-slate-100 rounded-full w-full h-8 flex relative">
      <div
        className="bg-blue-300 m-0.5 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600">{`${value}/${max}`}</div>
    </div>
  );
}
