import React from 'react';
import _ from 'lodash';
import { Activity } from '../type/Activity';
import Button from './Button';

const formatTableContent = (
  fullActivities: Activity[],
  activities: Activity[],
  onChange: (activities: Activity[]) => void,
  curr: JSX.Element[][] = [[]],
  currKeys: string[] = [],
  deepLevel: number = 0,
): JSX.Element[][] => {
  let res: JSX.Element[][] = curr;
  // eslint-disable-next-line no-restricted-syntax
  activities.forEach((activity, index) => {
    // eslint-disable-next-line prefer-spread
    if (index > 0) {
      // eslint-disable-next-line prefer-spread
      res = [...res, Array.apply(null, { length: deepLevel } as any).map(() => <td />)];
    }
    const newKeys = [...currKeys, activity.value];
    const td = (
      <td className="[&>*]:w-full">
        <Button
          text={activity.value}
          color={['bg-slate-100', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500'][activity.level]}
          textColor={activity.level > 2 ? 'text-white' : undefined}
          size="md"
          onClick={() => {
            // TODO: REFACTOR MY BRAIN IS DEAD
            const result = _.cloneDeep(fullActivities);
            let lastEl = result.find((a) => a.value === newKeys[0]);
            // eslint-disable-next-line no-restricted-syntax
            for (const k of newKeys) {
              const el = lastEl?.subActivities?.find((a) => a.value === k);
              if (el) {
                lastEl = el;
              }
            }
            const newLevel = lastEl ? (lastEl.level + 1) % 4 : 0;
            if (lastEl) lastEl.level = newLevel;
            const test = (act: Activity, maxLevel: number) => {
              act?.subActivities?.forEach((a) => {
                // eslint-disable-next-line no-param-reassign
                a.level = Math.min(a.level, maxLevel);
                if (a.subActivities) test(a, maxLevel);
              });
            };
            if (lastEl) test(lastEl, newLevel);
            lastEl = result.find((a) => a.value === newKeys[0]);
            // eslint-disable-next-line no-restricted-syntax
            for (const k of newKeys) {
              if (lastEl) lastEl.level = Math.max(lastEl.level, newLevel);
              const el = lastEl?.subActivities?.find((a) => a.value === k);
              if (el) {
                lastEl = el;
              }
            }
            onChange(result);
          }}
        />
      </td>
    );
    if (activity.subActivities) {
      res = formatTableContent(
        fullActivities,
        activity.subActivities,
        onChange,
        [...res.slice(0, -1), [...res[res.length - 1], td]],
        newKeys,
        deepLevel + 1,
      );
    } else {
      res = [...res.slice(0, -1), [...res[res.length - 1], td]];
    }
  });
  return res;
};
export default function ActivitySelector({
  activities,
  onChange,
}: {
  activities: Activity[];
  onChange: (activities: Activity[]) => void;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Level 1</th>
          <th>Level 2</th>
          <th>Level 3</th>
          <th>Level 4</th>
        </tr>
      </thead>
      <tbody>
        {formatTableContent(activities, activities, onChange).map((tr) => (
          <tr>{tr}</tr>
        ))}
      </tbody>
    </table>
  );
}
