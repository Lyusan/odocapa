import React from 'react';
import { DataPropertyType } from '../service/firestore.service';
import Button from './Button';

interface ButtonProp {
  type: DataPropertyType;
  onClick: (nextType: DataPropertyType) => void;
}
const config = {
  [DataPropertyType.COPY]: { textColor: 'bg-blue-500' },
  [DataPropertyType.COPY_EDITED]: { textColor: 'bg-green-500' },
  [DataPropertyType.CUSTOM]: { textColor: 'bg-cyan-500' },
};

const types = Object.values(DataPropertyType);

export default function ButtonDataPropertyType({ type, onClick }: ButtonProp) {
  return (
    <Button
      text={type}
      textColor="text-white"
      color={config[type].textColor}
      size="s"
      onClick={() => onClick(types[(types.findIndex((t) => t === type) + 1) % types.length])}
    />
  );
}
