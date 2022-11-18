import React from 'react';
import { Categorie } from '../type/Categorie';

interface ColorPickerProps {
  categorie: Categorie;
  selected: boolean;
  onCategorieClick: (categorie: Categorie) => void;
}

export default function CategorieSelector({
  categorie,
  selected,
  onCategorieClick,
}: ColorPickerProps) {
  return (
    <div
      onClick={() => {
        onCategorieClick(categorie);
      }}
    >
      <div
        className="px-2.5 py-0.5 m-2 cursor-pointer bg-white rounded-full select-none"
        style={{
          background: selected ? 'orange' : 'white',
          fontWeight: selected ? 600 : 400,
        }}
      >
        {categorie.name}
      </div>
    </div>
  );
}
