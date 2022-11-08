import moment from 'moment';
import React, { useEffect, useState } from 'react';

export default function DateMomentAgo({ date }: { date: Date }) {
  const [formatedDate, setFormatedDate] = useState(moment(date).fromNow());
  useEffect(() => {
    setFormatedDate(moment(date).fromNow());
    const interval = setInterval(() => {
      setFormatedDate(moment(date).fromNow());
    }, 15000);
    return () => clearInterval(interval);
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatedDate}</>;
}
