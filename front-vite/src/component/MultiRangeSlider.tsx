import React from 'react';

type Range = {
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  minThumb: number;
  maxThumb: number;
};

const computeMinThumb = (range: Range) => ({
  ...range,
  minThumb: Math.max(((range.minValue - range.min) / (range.max - range.min)) * 100) / 1.07,
});

const computeMaxThumb = (range: Range) => ({
  ...range,
  maxThumb: (100 - ((range.maxValue - range.min) / (range.max - range.min)) * 100) / 1.07,
});

const minTrigger = (range: any, newValue: number) => {
  const minValue = Math.min(newValue, range.maxValue);
  return computeMinThumb({ ...range, minValue });
};

const maxTrigger = (range: any, newValue: number) => {
  const maxValue = Math.max(newValue, range.minValue);
  return computeMaxThumb({ ...range, maxValue });
};

/**
 * Multiple Range Slider
 * source: https://tailwindcomponents.com/component/multi-range-slider
 */
export default function MultiRangeSlider({
  range,
  changeRange,
}: {
  range: Range;
  changeRange: (range: Range) => void;
}) {
  return (
    <div className="relative  w-full">
      <div>
        <div className="flex z-10 h-2 w-full justify-center">
          <div className="relative w-11/12">
            <input
              type="range"
              step="1"
              min={range.min}
              max={range.max}
              value={range.minValue}
              onChange={(e) => {
                changeRange(minTrigger(range, Number(e.target.value)));
              }}
              className="absolute pointer-events-none appearance-none z-40 h-2 w-[98%] opacity-0 cursor-pointer -top-1"
            />

            <input
              type="range"
              step="1"
              min={range.min}
              max={range.max}
              value={range.maxValue}
              onChange={(e) => {
                changeRange(maxTrigger(range, Number(e.target.value)));
              }}
              className="absolute pointer-events-none appearance-none z-40 h-2 w-[98%] right-0 opacity-0 cursor-pointer -top-1"
            />
            <div className="absolute z-10 left-0 right-0 top-0.5 bottom-0.5  h-1 rounded-md bg-gray-200" />

            <div
              className="absolute z-20 top-0.5 bottom-0.5 rounded-md bg-main-blue h-1"
              style={{
                right: `${range.maxThumb}%`,
                left: `${range.minThumb}%`,
              }}
            />

            <div
              className="absolute z-30 w-4 h-4 top-0 left-0 bg-main-blue rounded-full -mt-1 -ml-0.5"
              style={{
                left: `${range.minThumb}%`,
              }}
            />

            <div
              className="absolute z-30 w-4 h-4 top-0 right-0 bg-main-blue rounded-full -mt-1 -mr-0"
              style={{
                right: `${range.maxThumb}%`,
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 pb-2">
          <div>
            <input
              type="number"
              value={range.minValue}
              onChange={(e) => {
                changeRange(minTrigger(range, Number(e.target.value)));
              }}
              className="px-1 py-0.5 border border-gray-200 rounded w-16 text-center text-sm"
            />
          </div>
          <div>
            <input
              type="number"
              value={range.maxValue}
              onChange={(e) => {
                changeRange(maxTrigger(range, Number(e.target.value)));
              }}
              className="px-1 py-0.5 border border-gray-200 rounded w-16 text-center text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
