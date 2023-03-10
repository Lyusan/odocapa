/* eslint-disable no-confusing-arrow */
/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import { Street } from '../type/Street';
import SelectButton from './SelectButton';

interface StreetCardProp {
  street: Street;
}

export default function SideCardStreet({ street }: StreetCardProp) {
  const [currentDisplay, setCurrentDisplay] = useState(-1);
  useEffect(() => {
    setCurrentDisplay(-1);
  }, [street]);
  let page = null;
  if (currentDisplay === -1) {
    page = (
      <div className={classNames('[&>*]:py-1 h-5/6')}>
        <div className="flex text-sm mb-3">
          <p className="pr-12">
            <strong className="pr-1">Longueur:</strong>
            {`${street.length.value} m`}
            <br />
            <strong className="pr-1">Largeur:</strong>
            {`${street.width.value} m`}
          </p>
          <p className="pr-4">
            <strong className="pr-1">Date de création:</strong>
            {street.creationDate.value || 'inconnue'}
            <br />
            <strong className="pr-1">Date de dénomination:</strong>
            {street.namingDate.value || 'inconnue'}
          </p>
        </div>

        <p className="text-sm">
          <h2 className="font-bold pb-0.5">Origine du nom</h2>
          {street.nameOrigin.value.split('\n').map((line) => (
            <p className="py-1">{line}</p>
          ))}
        </p>
        <p className="text-sm">
          <h2 className="font-bold pb-0.5">Histoire de la rue</h2>
          {street.nameDescription.value.split('\n').map((line) => (
            <p className="py-0.5">{line}</p>
          ))}
        </p>
      </div>
    );
  } else if (currentDisplay === street.subItems.length) {
    page = <CategoryList street={street} />;
  } else {
    page = street.subItems[currentDisplay].description.source ? (
      <div className={classNames('[&>*]:py-1 h-full')}>
        <iframe
          title="Wikipedia"
          height="100%"
          width="100%"
          src={street.subItems[currentDisplay].description.source!}
        />
      </div>
    ) : null;
  }
  return (
    <>
      <div className="flex gap-3 justify-center items-center mb-4">
        <SelectButton
          name="Rue"
          selected={currentDisplay === -1}
          onClick={() => setCurrentDisplay(-1)}
        />
        {street.subItems
          .map((subItem, subItemIndex) =>
            subItem.description.source ? (
              <SelectButton
                name={subItem.name.value}
                selected={currentDisplay === subItemIndex}
                onClick={() => setCurrentDisplay(subItemIndex)}
              />
            ) : null,
          )
          .filter((item) => item !== null)}
        <SelectButton
          name="Categories"
          selected={currentDisplay === street.subItems.length}
          onClick={() => setCurrentDisplay(street.subItems.length)}
        />
      </div>
      <div className="overflow-auto max-h-full">{page}</div>
    </>
  );
}
