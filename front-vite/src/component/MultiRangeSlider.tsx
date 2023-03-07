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
  minThumb: (((range.minValue - range.min) / (range.max - range.min)) * 100) / 1.05,
});

const computeMaxThumb = (range: Range) => ({
  ...range,
  maxThumb: (100 - ((range.maxValue - range.min) / (range.max - range.min)) * 100) / 1.05,
});

const minTrigger = (range: any, newValue: number) => {
  const minValue = Math.min(newValue, range.maxValue - 1);
  return computeMinThumb({ ...range, minValue });
};

const maxTrigger = (range: any, newValue: number) => {
  const maxValue = Math.max(newValue, range.minValue + 1);
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
        <input
          type="range"
          step="1"
          min={range.min}
          max={range.max}
          value={range.minValue}
          onChange={(e) => {
            changeRange(minTrigger(range, Number(e.target.value)));
          }}
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
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
          className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
        />

        <div className="relative z-10 h-2">
          <div className="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200" />

          <div
            className="absolute z-20 top-0 bottom-0 rounded-md bg-main-blue"
            style={{
              right: `${range.maxThumb}%`,
              left: `${range.minThumb}%`,
            }}
          />

          <div
            className="absolute z-30 w-6 h-6 top-0 left-0 bg-main-blue rounded-full -mt-2 -ml-1"
            style={{
              left: `${range.minThumb}%`,
            }}
          />

          <div
            className="absolute z-30 w-6 h-6 top-0 right-0 bg-main-blue rounded-full -mt-2 -mr-3"
            style={{
              right: `${range.maxThumb}%`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center py-5">
        <div>
          <input
            type="number"
            maxLength={5}
            value={range.minValue}
            onChange={(e) => {
              changeRange(minTrigger(range, Number(e.target.value)));
            }}
            className="px-3 py-2 border border-gray-200 rounded w-24 text-center"
          />
        </div>
        <div>
          <input
            type="number"
            maxLength={5}
            value={range.maxValue}
            onChange={(e) => {
              changeRange(maxTrigger(range, Number(e.target.value)));
            }}
            className="px-3 py-2 border border-gray-200 rounded w-24 text-center"
          />
        </div>
      </div>
    </div>
  );
}
