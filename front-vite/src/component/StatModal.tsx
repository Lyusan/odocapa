import { ChartData } from 'chart.js';
import 'chart.js/auto';
import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Category } from '../type/Category';
import { Street } from '../type/Street';

export default function StatModal({
  category,
  streets,
}: {
  category: Category;
  streets: Street[];
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
  const data1 = category.values.map(
    (v) => streets.filter((s) => category.categorize(s)?.primary?.name === v.name).length,
  );
  const d1: ChartData<'bar', number[], string> = {
    labels: category.values.map((v) => v.name),
    datasets: [
      {
        label: 'Nombre de rues par categorie',
        data: data1,
        backgroundColor: category.values.map((v) => v.color),
        borderWidth: 1,
      },
    ],
  };
  const d2: ChartData<'bar', number[], string> = {
    labels: category.values.map((v) => v.name),
    datasets: [
      {
        label:
          'Longueur moyenne des rues par categorie (Les rues sans longueur ne sont pas comptabilisé)',
        pointStyle: 'triangle',
        data: category.values
          .map((v) =>
            streets
              .map((s) => {
                if (category.categorize(s)?.primary?.name === v.name && s.length.value) {
                  return Number(s.length.value) || 0;
                }
                return 0;
              })
              .reduce((acc, curr) => acc + curr, 0),
          )
          .map((v, index) => v / data1[index]),
        backgroundColor: category.values.map((v) => v.color),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="flex flex-col w-full justify-center items-center p-5 [&>*]:w-full">
      <div>{d1 ? <Bar ref={ref1} data={d1} options={options} /> : null}</div>
      <div>{d2 ? <Bar ref={ref2} data={d2} options={options} /> : null}</div>
    </div>
  );
}
