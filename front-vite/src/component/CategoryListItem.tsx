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
      <b className="text-sm">{`${level}:`}</b>
      {categories instanceof Array ? (
        <ul className="pl-5 flex flex-col justify-center gap-2">
          {categories.map((category) => (
            <li className="flex items-center gap-2 text-sm">
              <ColorPicker color={category.color} size={COLOR_PICKER_SIZE} />
              {category.name}
            </li>
          ))}
        </ul>
      ) : (
        <span className="pl-5 flex items-center gap-2 text-sm">
          <ColorPicker color={categories.color} size={COLOR_PICKER_SIZE} />
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
      <h2 className="text-l font-bold">{categoryDesc.name}</h2>
      {!category ||
      (!category.primary && category.secondary.length === 0 && category.tertiary.length === 0) ? (
        <div className="pl-5">Pas de catégorie trouvée...</div>
      ) : (
        <div className="pl-5">
          {category.primary && (
            <CategoryValuesPerLevel level="Primaire" categories={category.primary} />
          )}
          {category.secondary?.length > 0 ? (
            <CategoryValuesPerLevel level="Secondaire" categories={category.secondary} />
          ) : null}
          {category.tertiary?.length > 0 ? (
            <CategoryValuesPerLevel level="Tertiaire" categories={category.tertiary} />
          ) : null}
        </div>
      )}
    </div>
  );
}
