import React, { useEffect, useState } from 'react';
import BaseSelect from '../component/BaseSelect';
import Button from '../component/Button';
import FormBuilder from '../component/FormBuilder';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  DataProperty,
  DataPropertyType,
  DEFAULT_STREET_SUB_ITEM,
  getStreetDoc,
  getStreetSubItemDoc,
  getStreetSubItemsDocs,
  MinimalStreet,
  MinimalStreetSub,
  Street,
  StreetSubItemPerson,
} from '../service/firestore.service';
import { InputDesc } from '../type/Input';
import StreetFormWikiHelper from './StreetFormWikiHelper';
import MapStreetViewer from '../component/Map/MapStreetViewer';

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

const DEFAULT_SUB_FORM = [
  {
    id: 'subNameInput',
    name: 'name',
    label: 'Nom complet',
    type: 'text',
  },
  {
    id: 'subDescInput',
    name: 'description',
    label: 'Description',
    type: 'textarea',
  },
];

const PERSON_FORM = [
  ...DEFAULT_SUB_FORM,
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
  ...DEFAULT_SUB_FORM,
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
  Personne: PERSON_FORM,
  Bataille: BATTLE_FORM,
} as Record<string, InputDesc[]>;

export default function StreetForm({ minimalStreet }: StreetFormProp) {
  const [street, setStreet] = useState<Street | null>(null);
  const [streetSubName, setStreetSubName] = useState<string>('');
  const [streetSubItem, setStreetSubItem] = useState<StreetSubItemPerson | null>(null);
  const [streetSubItems, setStreetSubItems] = useState<MinimalStreetSub[]>([]);
  useEffect(() => {
    (async () => {
      if (minimalStreet) {
        const newStreet = await getStreetDoc(minimalStreet.id);
        setStreet(newStreet);
      }
    })();
  }, [minimalStreet]);
  useEffect(() => {
    // TOTO: improve perf by checking that only type change
    (async () => {
      if (street) {
        const items = await getStreetSubItemsDocs(street.typeOfName.value);
        setStreetSubItems(items);
        if (street.subId) {
          const item = await getStreetSubItemDoc(street.subId);
          setStreetSubItem(item);
        }
      }
    })();
  }, [street]);
  const handleFormChange = (
    name: string,
    value: any,
    source: string | null = null,
    isCopy: boolean = false,
  ) => {
    if (street) {
      const oldType = ((street as any)[name] as DataProperty).type;
      const oldSource = ((street as any)[name] as DataProperty).source;
      const computeType = () => {
        if (isCopy) return DataPropertyType.COPY;
        if (oldType === DataPropertyType.COPY || oldType === DataPropertyType.COPY_EDITED) {
          return DataPropertyType.COPY_EDITED;
        }
        return DataPropertyType.CUSTOM;
      };
      const type = computeType();
      setStreet({
        ...street,
        [name]: {
          ...((street as any)[name] as DataProperty),
          value,
          source: source || oldSource,
          type,
          lastUpdate: new Date(),
        },
        lastUpdate: new Date(),
      });
    }
  };
  const handleDataPropTypeFormChange = (name: string, type: DataPropertyType) => {
    if (street) {
      setStreet({
        ...street,
        [name]: {
          ...((street as any)[name] as DataProperty),
          type,
          lastUpdate: new Date(),
        },
        lastUpdate: new Date(),
      });
    }
  };
  const handleSubFormChange = (
    name: string,
    value: any,
    source: string | null = null,
    isCopy: boolean = false,
  ) => {
    const oldType = ((streetSubItem as any)[name] as DataProperty).type;
    const oldSource = ((streetSubItem as any)[name] as DataProperty).source;
    const computeType = () => {
      if (isCopy) return DataPropertyType.COPY;
      if (oldType === DataPropertyType.COPY || oldType === DataPropertyType.COPY_EDITED) {
        return DataPropertyType.COPY_EDITED;
      }
      return DataPropertyType.CUSTOM;
    };
    const type = computeType();
    if (streetSubItem) {
      setStreetSubItem({
        ...streetSubItem,
        [name]: {
          ...((streetSubItem as any)[name] as DataProperty),
          value,
          source: source || oldSource,
          type,
          lastUpdate: new Date(),
        },
        lastUpdate: new Date(),
      });
    }
  };
  const specificFormParam = FORM_RECORD[street?.typeOfName?.value || ''] || DEFAULT_SUB_FORM;
  console.log(streetSubItem);
  const specificForm = (
    <FormBuilder
      form={specificFormParam}
      values={streetSubItem as any}
      onValueChange={handleSubFormChange}
      onTypeChange={() => {}}
    />
  );

  const detachSubObject = () => {
    setStreetSubName('');
    handleFormChange('subId', null);
    setStreetSubItem(null);
  };

  return (
    <div className="flex w-full">
      {!street ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="w-1/2 p-4 relative overflow-y-auto">
            <div className="absolute right-4">
              <Button color="bg-blue-500" textColor="text-white" text="SAVE" onClick={() => null} />
            </div>
            <div className="flex items-center">
              <div className="w-72 h-72">
                <MapStreetViewer coords={JSON.parse(street?.coords || '[[]]')} />
              </div>
              <h1 className="pl-5 text-3xl font-bold p-1">{street?.name}</h1>
            </div>
            <div className="my-8 mx-auto w-3/4 h-1 rounded-md bg-blue-500" />
            <FormBuilder
              form={GENERAL_FORM}
              values={street}
              onValueChange={handleFormChange}
              onTypeChange={handleDataPropTypeFormChange}
            />
            <div className="my-8 mx-auto w-3/4 h-1 rounded-md bg-blue-500" />
            <div className="flex [&>*]:w-1/2 gap-2">
              <BaseSelect
                name="selectSubObject"
                value={streetSubName}
                values={streetSubItems.map((item) => item.name)}
                withNoOption
                onChange={(name, value) => {
                  if (value === '') detachSubObject();
                  else {
                    setStreet({
                      ...street,
                      subId: streetSubItems.find((i) => i.name === value)?.id!,
                      lastUpdate: new Date(),
                    });
                    setStreetSubName(value);
                  }
                }}
              />
              {streetSubItem ? (
                <Button
                  color="bg-red-400"
                  text="Détacher l'object"
                  onClick={() => {
                    detachSubObject();
                  }}
                />
              ) : (
                <Button
                  color="bg-blue-500"
                  textColor="text-white"
                  text="Créé un nouvel object"
                  onClick={() => setStreetSubItem(DEFAULT_STREET_SUB_ITEM)}
                />
              )}
            </div>
            {streetSubItem ? specificForm : null}
          </div>
          <div className="w-1/2 p-4 overflow-y-auto">
            <StreetFormWikiHelper
              streetName={street.name}
              copyField={(propName, value, source) => {
                handleFormChange(propName, value, source, true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
