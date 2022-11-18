import React from 'react';
import { Categorie } from '../type/Categorie';
import ColorPicker from './ColorPicker';

interface LegendProps {
  categorie: Categorie;
}

export default function Legend({ categorie }: LegendProps) {
  return (
    <div className="flex flex-col">
      <strong className="mb-2">{categorie.name}</strong>
      {categorie.values.map((categoryValue) => (
        <div className="flex items-center">
          <ColorPicker color={categoryValue.color} size={10} />
          <div className="pl-2">{categoryValue.name}</div>
        </div>
      ))}
    </div>
  );
}
