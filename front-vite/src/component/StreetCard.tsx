import React from 'react';
import { SuperStreet } from '../type/Street';
import { SubItemPerson } from '../type/SubItem';
import ClosingButton from './ClosingButton';

interface StreetCardProp {
  street: SuperStreet;
  onClose: () => void;
}

export default function StreetCard({ street, onClose }: StreetCardProp) {
  let subItemElement = null;
  if (street.subItem) {
    const title = <h1 className="pb-4 text-xl font-bold">{street.subItem.name.value}</h1>;
    const desc = (
      <p>
        <h2 className="font-semibold">Description</h2>
        {street.subItem.description.value}
      </p>
    );
    switch (street.subItem.type) {
      case 'Personne':
        // eslint-disable-next-line no-case-declarations
        const person = street.subItem as SubItemPerson;
        subItemElement = (
          <>
            {title}
            <div className="flex [&>p]:w-1/2">
              <p>
                {`Naissance: ${person.birthday.value}`}
                <br />
                {`Décès: ${person.deathday.value}`}
              </p>
              <p>
                {`Genre: ${person.gender.value}`}
                <br />
                {`Nationalité: ${person.nationality.value}`}
              </p>
            </div>
            {desc}
          </>
        );
        break;
      default:
        subItemElement = (
          <>
            {title}
            {desc}
          </>
        );
        break;
    }
  }
  return (
    <div className="p-2 relative">
      <h1 className="pb-4 text-2xl text-center">{street.name}</h1>
      <div className="absolute right-2 top-2">
        <ClosingButton onClose={onClose} />
      </div>
      <div className="[&>*]:py-1">
        <div className="flex [&>p]:w-1/2">
          <p>
            {`Longueur: ${street.length.value}`}
            <br />
            {`Largeur: ${street.width.value}`}
          </p>
          <p>
            {`Date de création: ${street.creationDate.value}`}
            <br />
            {`Date de dénomination: ${street.namingDate.value}`}
          </p>
        </div>

        <p>
          <h2 className="font-semibold">Origine du nom</h2>
          {street.nameOrigin.value}
        </p>
        <p>
          <h2 className="font-semibold">Histoire de la rue</h2>
          {street.nameDescription.value}
        </p>
        {subItemElement}
      </div>
    </div>
  );
}
