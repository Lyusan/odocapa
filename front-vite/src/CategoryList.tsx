import React from 'react';
import CategoryListItem from './CategoryListItem';
import { CATEGORIES } from './type/Categorie';
import { Street } from './type/Street';

export default function CategoryList({ street }: { street: Street }) {
  return (
    <div>
      {CATEGORIES.map((c) => (
        <CategoryListItem street={street} category={c} />
      ))}
    </div>
  );
}
