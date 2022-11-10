import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

export default function DateMomentAgo({ date }: { date: Timestamp }) {
  if (!date) return null;
  const [formatedDate, setFormatedDate] = useState(moment(date.toDate()).fromNow());
  useEffect(() => {
    setFormatedDate(moment(date.toDate()).fromNow());
    const interval = setInterval(() => {
      setFormatedDate(moment(date.toDate()).fromNow());
    }, 15000);
    return () => clearInterval(interval);
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatedDate}</>;
}
