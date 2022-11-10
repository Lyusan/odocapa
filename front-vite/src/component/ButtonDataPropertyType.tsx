import React from 'react';
import { SourcedDataPropertyType } from '../type/SourcedDataProperty';
import Button from './Button';

interface ButtonProp {
  type: SourcedDataPropertyType;
  onClick: (nextType: SourcedDataPropertyType) => void;
}
const config = {
  [SourcedDataPropertyType.COPY]: { textColor: 'bg-blue-500' },
  [SourcedDataPropertyType.COPY_EDITED]: { textColor: 'bg-green-500' },
  [SourcedDataPropertyType.CUSTOM]: { textColor: 'bg-cyan-500' },
};

const types = Object.values(SourcedDataPropertyType);

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
