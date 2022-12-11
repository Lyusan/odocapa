import React from 'react';
import _ from 'lodash';
import { PoliticScale, POLITIC_SCALE_LIST } from '../type/PoliticScale';
import TextInput from './TextInput';

export default function PoliticScaleSelector({
  politicScale,
  onChange,
}: {
  politicScale: PoliticScale[];
  onChange: (politicScale: PoliticScale[]) => void;
}) {
  const fullPoliticScale = POLITIC_SCALE_LIST.map((ps) => ({
    value: ps,
    level: politicScale.find((e) => e.value === ps)?.level ?? 0,
  })).sort((e1, e2) => (e1.level < e2.level ? 1 : -1));
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        {fullPoliticScale.map((ps) => (
          <tr>
            <td>{ps.value}</td>
            <td>
              <TextInput
                id={ps.value}
                name={ps.value}
                value={ps.level}
                onChange={(_, value) =>
                  onChange(
                    fullPoliticScale
                      // eslint-disable-next-line no-confusing-arrow
                      .map((currPS) =>
                        currPS.value === ps.value
                          ? { value: ps.value, level: Number(value) }
                          : currPS,
                      )
                      .filter((e) => e.level > 0)
                      .sort((e1, e2) => (e1.level < e2.level ? 1 : -1)),
                  )
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
