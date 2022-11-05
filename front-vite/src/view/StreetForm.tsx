import React, { useEffect, useState } from 'react';
import BaseSelect from '../component/BaseSelect';
import Button from '../component/Button';
import FormBuilder from '../component/FormBuilder';
import {
  getStreetDoc,
  getStreetSubItemsDocs,
  MinimalStreet,
  Street,
  StreetSubItemPerson,
} from '../service/firestore.service';
import { InputDesc } from '../type/Input';
import StreetFormWikiHelper from './StreetFormWikiHelper';

interface StreetFormProp {
  minimalStreet: MinimalStreet;
}
const GENERAL_FORM = [
  {
    id: 'generalNameOriginInput',
    name: 'nameOrigin',
    label: 'Origine du nom de la rue',
    type: 'textarea',
  },
  {
    id: 'generalNameDescriptionInput',
    name: 'nameDescription',
    label: 'Description du nom de la rue',
    type: 'textarea',
  },
  {
    id: 'generalTypeOfNameInput',
    name: 'typeOfName',
    label: 'Type de nom de la rue',
    type: 'select',
    values: ['Personne', 'Ville', 'Bataille', 'Autre'],
  },
] as InputDesc[];

const PERSON_FORM = [
  {
    id: 'personnameInput',
    name: 'name',
    label: 'Nom complet',
    type: 'text',
  },
  {
    id: 'personBirthdayInput',
    name: 'birthday',
    label: 'Date de naissance',
    type: 'text',
  },
  {
    id: 'personDeathdayInput',
    name: 'deathday',
    label: 'Date du décès',
    type: 'text',
  },
  {
    id: 'personGenderInput',
    name: 'gender',
    label: 'Genre',
    type: 'select',
    values: ['Inconnu', 'Homme', 'Femme'],
  },
] as InputDesc[];

const BATTLE_FORM = [
  {
    id: 'battleDateStartInput',
    name: 'date',
    label: 'Date de debut',
    type: 'text',
  },
  {
    id: 'battleDateStartInput',
    name: 'end',
    label: 'Date de fin',
    type: 'text',
  },
] as InputDesc[];

const FORM_RECORD = {
  Personne: { name: 'person', form: PERSON_FORM },
  Bataille: { name: 'battle', form: BATTLE_FORM },
} as Record<string, { name: string; form: InputDesc[] }>;

export default function StreetForm({ minimalStreet }: StreetFormProp) {
  const [street, setStreet] = useState<Street | null>(null);
  const [streetSubItems, setStreetSubItems] = useState<StreetSubItemPerson[]>([]);
  useEffect(() => {
    (async () => {
      if (minimalStreet) {
        const newStreet = await getStreetDoc(minimalStreet.id);
        if (!newStreet.typeOfName) newStreet.typeOfName = 'Personne';
        setStreet(newStreet);
      }
    })();
  }, [minimalStreet]);
  useEffect(() => {
    // TOTO: improve perf by checking that only type change
    (async () => {
      if (street) {
        const items = await getStreetSubItemsDocs(street.typeOfName);
        setStreetSubItems(items);
      }
    })();
  }, [street]);
  const handleFormChange = (name: string, value: string) => {
    if (street) {
      setStreet({ ...street, [name]: value, lastUpdate: new Date().toISOString() });
    }
  };
  const specificFormParam = FORM_RECORD[street?.typeOfName || ''];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const specificForm = specificFormParam ? (
    <FormBuilder
      form={specificFormParam.form}
      values={(street as any)[specificFormParam.name]}
      onChange={handleFormChange}
    />
  ) : null;
  return (
    <div className="flex w-full">
      {!street ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="w-1/2 p-4 relative">
            <div className="absolute right-4">
              <Button color="bg-blue-400" text="SAVE" onClick={() => null} />
            </div>
            <h1 className="text-3xl font-bold text-center p-1">{street?.name}</h1>
            <FormBuilder form={GENERAL_FORM} values={street} onChange={handleFormChange} />
            <div className="my-8 mx-auto w-3/4 h-1 rounded-md bg-slate-400" />

            <Button color="bg-blue-400" text="Créé un nouvel object" onClick={() => null} />
            <BaseSelect
              name="selectSubObject"
              value=""
              values={streetSubItems.map((item) => item.name)}
              onChange={() => null}
            />
            {/* {specificForm} */}
          </div>
          <div className="w-1/2 p-4">
            <StreetFormWikiHelper streetName={street.name} />
          </div>
        </>
      )}
    </div>
  );
}
