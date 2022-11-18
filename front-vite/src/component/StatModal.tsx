import { ChartData } from 'chart.js';
import 'chart.js/auto';
import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Categorie } from '../type/Categorie';
import { SuperStreet } from '../type/Street';
import ClosingButton from './ClosingButton';

export default function StatModal({
  category,
  streets,
  onClose,
}: {
  category: Categorie;
  streets: SuperStreet[];
  onClose: () => void;
}) {
  const options = {
    plugins: {
      legend: {
        labels: {
          boxWidth: 0,
        },
      },
    },
  };
  const ref1 = useRef();
  const ref2 = useRef();
  const d1: ChartData<'bar', number[], string> = {
    labels: category.values.map((v) => v.name),
    datasets: [
      {
        label: 'Nombre de rue par categorie',
        data: category.values.map(
          (v) => streets.filter((s) => category.categorize(s)?.name === v.name).length,
        ),
        backgroundColor: category.values.map((v) => v.color),
        borderWidth: 1,
      },
    ],
  };
  const d2: ChartData<'bar', number[], string> = {
    labels: category.values.map((v) => v.name),
    datasets: [
      {
        label: 'Longueur des rues par categorie',
        pointStyle: 'triangle',
        data: category.values.map((v) =>
          streets
            .map((s) => {
              if (category.categorize(s)?.name === v.name && s.length.value) {
                return Number(s.length.value[0].replace('m', '').trim()) || 0;
              }
              return 0;
            })
            .reduce((acc, curr) => acc + curr, 0),
        ),
        backgroundColor: category.values.map((v) => v.color),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full bg-gray-700/60"
    >
      <div className="relative w-full max-w-6xl h-full md:h-auto m-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Statistique</h3>
            <ClosingButton onClose={onClose} />
          </div>
          <div className="p-6 space-y-6">
            <div className="flex w-full [&>*]:w-1/2">
              <div>{d1 ? <Bar ref={ref1} data={d1} options={options} /> : null}</div>
              <div>{d2 ? <Bar ref={ref2} data={d2} options={options} /> : null}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
