import React from 'react';
import ColorPicker from './ColorPicker';
import { CategoryValue, Category } from '../type/Category';
import { Street } from '../type/Street';

const COLOR_PICKER_SIZE = 15;

/**
 * Display category values for a given level
 */
function CategoryValuesPerLevel({
  level,
  categories,
}: {
  level: string;
  categories: CategoryValue | CategoryValue[];
}) {
  return (
    <p>
      <b>{`${level}:`}</b>
      {categories instanceof Array ? (
        <ul className="pl-2 flex flex-col justify-center gap-2">
          {categories.map((category) => (
            <li className="flex items-center gap-2">
              <ColorPicker color={category.color || ''} size={15} />
              {category.name}
            </li>
          ))}
        </ul>
      ) : (
        <span className="pl-2 flex items-center gap-2">
          <ColorPicker color={categories.color || ''} size={COLOR_PICKER_SIZE} />
          {categories.name}
        </span>
      )}
    </p>
  );
}

interface CategoryListItemProp {
  street: Street;
  categoryDesc: Category;
}

/**
 * Display all the category values for a given street and a specific category
 */
export default function CategoryListItem({ street, categoryDesc }: CategoryListItemProp) {
  const category = categoryDesc.categorize(street);
  return (
    <div>
      <h2 className="text-xl font-bold">{categoryDesc.name}</h2>
      {!category ? (
        <div>Pas de catégorie trouvée...</div>
      ) : (
        <>
          {category.primary && (
            <CategoryValuesPerLevel level="Primary" categories={category.primary} />
          )}
          {category.secondary?.length > 0 ? (
            <CategoryValuesPerLevel level="Secondary" categories={category.secondary} />
          ) : null}
          {category.tertiary?.length > 0 ? (
            <CategoryValuesPerLevel level="Tertiary" categories={category.tertiary} />
          ) : null}
        </>
      )}
    </div>
  );
}
