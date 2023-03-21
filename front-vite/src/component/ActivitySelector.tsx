import React from 'react';
import _ from 'lodash';
import { Activity, DEFAULT_ACTIVITIES } from '../type/Activity';
import TextButton from './TextButton';

// TODO: refactor activities with subActivitities -> Record<string, Activitities>
// better perfomance no need to use find()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOnlyLeveledActivities(activities: Activity[]): Activity[] {
  return activities.reduce((acc, curr) => {
    if (curr.level === 0) return acc;
    const newCurr: Activity = { ...curr };
    if (newCurr.subActivities) {
      newCurr.subActivities = getOnlyLeveledActivities(newCurr.subActivities);
      if (!newCurr.subActivities?.length) delete newCurr.subActivities;
    }
    return [...acc, newCurr];
  }, [] as Activity[]);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mergeActivities(full: Activity[], partial: Activity[]): Activity[] {
  return full.reduce((acc, curr) => {
    const partialCurr = partial.find((p) => p.value === curr.value);
    const newCurr: Activity = { ...curr };
    if (partialCurr) {
      newCurr.level = partialCurr.level;
      if (newCurr.subActivities && partialCurr.subActivities) {
        newCurr.subActivities = mergeActivities(newCurr.subActivities, partialCurr.subActivities);
      }
    }
    return [...acc, newCurr];
  }, [] as Activity[]);
}

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
        <TextButton
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
            onChange(getOnlyLeveledActivities(result));
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
  const fullActivities = mergeActivities(DEFAULT_ACTIVITIES, activities);
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
        {formatTableContent(fullActivities, fullActivities, onChange).map((tr) => (
          <tr>{tr}</tr>
        ))}
      </tbody>
    </table>
  );
}
