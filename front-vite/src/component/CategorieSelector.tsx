import React from 'react';
import classNames from 'classnames';
import { Category } from '../type/Category';

interface CategorySelectorProps {
  categorie: Category;
  selected: boolean;
  onCategorieClick: (categorie: Category) => void;
}

export default function CategorySelector({
  categorie,
  selected,
  onCategorieClick,
}: CategorySelectorProps) {
  return (
    <div style={{ width: 'fit-content' }}>
      <div
        className={classNames(
          'px-3.5 py-1 mx-1 rounded-full select-none transition-all duration-500 border-2 border-black bg-white',
          {
            'text-xs font-normal opacity-60 cursor-pointer hover:opacity-100': !selected,
          },
          { 'font-semibold ': selected },
        )}
        onClick={() => {
          if (!selected) onCategorieClick(categorie);
        }}
      >
        {categorie.name}
      </div>
    </div>
  );
}
