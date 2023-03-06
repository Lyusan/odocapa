import React from 'react';
import CategoryListItem from './CategoryListItem';
import { CATEGORIES_DESC } from '../type/Category';
import { Street } from '../type/Street';

/**
 * Display all the category values for a given street
 * @param street
 * @return {JSX.Element}
 */
export default function CategoryList({ street }: { street: Street }) {
  return (
    <div>
      {CATEGORIES_DESC.map((categoryDesc) => (
        <CategoryListItem street={street} categoryDesc={categoryDesc} />
      ))}
    </div>
  );
}
