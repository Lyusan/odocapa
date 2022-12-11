import React from 'react';
import ColorPicker from './component/ColorPicker';
import { Categorie } from './type/Categorie';
import { Street } from './type/Street';

interface CategoryListItemProp {
  street: Street;
  category: Categorie;
}

export default function CategoryListItem({ street, category }: CategoryListItemProp) {
  const cat = category.categorize(street);
  return (
    <div>
      <h2 className="text-xl font-bold">{category.name}</h2>
      {!cat ? (
        <div>Pas de catégorie trouvé...</div>
      ) : (
        <>
          <p>
            <b>Primary:</b>
            <span className="pl-2 flex items-center gap-2">
              <ColorPicker color={cat.primary?.color || ''} size={15} />
              {cat.primary?.name}
            </span>
          </p>
          {cat.secondary?.length > 0 ? (
            <p>
              <b>Secondary:</b>
              <ul className="pl-2 flex flex-col justify-center gap-2">
                {cat.secondary?.map((sec) => (
                  <li className="flex items-center gap-2">
                    <ColorPicker color={sec.color || ''} size={15} />
                    {sec.name}
                  </li>
                ))}
              </ul>
            </p>
          ) : null}
          {cat.tertiary?.length > 0 ? (
            <p>
              <b>Tertiary:</b>
              <ul className="pl-2 flex flex-col justify-center gap-2">
                {cat.tertiary?.map((ter) => (
                  <li className="flex items-center gap-2">
                    <ColorPicker color={ter.color || ''} size={15} />
                    {ter.name}
                  </li>
                ))}
              </ul>
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
