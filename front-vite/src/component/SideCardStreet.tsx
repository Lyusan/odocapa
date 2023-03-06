/* eslint-disable no-confusing-arrow */
/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import { Street } from '../type/Street';

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
      <div className={classNames({ 'animation-in': true }, '[&>*]:py-1 h-5/6')}>
        <div className="flex [&>p]:w-1/2">
          <p>
            {`Longueur: ${street.length.value} m`}
            <br />
            {`Largeur: ${street.width.value} m`}
          </p>
          <p>
            {`Date de création: ${street.creationDate.value}`}
            <br />
            {`Date de dénomination: ${street.namingDate.value}`}
          </p>
        </div>

        <p>
          <h2 className="font-semibold pb-1.5">Origine du nom</h2>
          {street.nameOrigin.value.split('\n').map((line) => (
            <p className="py-1">{line}</p>
          ))}
        </p>
        <p>
          <h2 className="font-semibold pb-1.5">Histoire de la rue</h2>
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
      <div className={classNames({ 'animation-in': true }, '[&>*]:py-1 h-full')}>
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
      <div className="flex border-b-2 gap-3">
        <button
          className={classNames(' border-orange-500', {
            ' border-b-4 font-semibold': currentDisplay === -1,
            'test-abc': currentDisplay !== -1,
          })}
          type="button"
          onClick={() => setCurrentDisplay(-1)}
        >
          Rue
        </button>
        {street.subItems
          .map((subItem, subItemIndex) =>
            subItem.description.source ? (
              <button
                className={classNames('border-orange-500', {
                  'border-b-4 font-semibold': currentDisplay === subItemIndex,
                })}
                type="button"
                onClick={() => setCurrentDisplay(subItemIndex)}
              >
                {subItem.name.value}
              </button>
            ) : null,
          )
          .filter((item) => item !== null)}
        <button
          className={classNames('border-orange-500', {
            'border-b-4 font-semibold': currentDisplay === street.subItems.length,
          })}
          type="button"
          onClick={() => setCurrentDisplay(street.subItems.length)}
        >
          Categories
        </button>
      </div>
      <div className="overflow-auto max-h-full">{page}</div>
    </>
  );
}

interface Tree {
  value: number;
  left: Tree | null;
  right: Tree | null;
}
