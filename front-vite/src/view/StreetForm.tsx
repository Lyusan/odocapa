import React, { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import BaseSelect from '../component/BaseSelect';
import Button from '../component/Button';
import FormBuilder from '../component/FormBuilder';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  getStreetDoc,
  getStreetSubItemDoc,
  getStreetSubItemsDocs,
  setStreetDoc,
  setSubItemDoc,
} from '../service/firestore.service';
import StreetFormWikiHelper from './StreetFormWikiHelper';
import MapStreetViewer from '../component/Map/MapStreetViewer';
import { Street, STREET_FORM_DESC } from '../type/Street';
import { MinimalStreetSub, SubItem, SUB_ITEM_MAP } from '../type/SubItem';
import { SourcedDataPropertyType } from '../type/SourcedDataProperty';

interface StreetFormProp {
  streetId: string | null;
  onSaveStreet: (street: Street) => void;
}

export default function StreetForm({ streetId, onSaveStreet }: StreetFormProp) {
  const [street, setStreet] = useState<Street | null>(null);
  const [streetSubName, setStreetSubName] = useState<string>('');
  const [streetSubItem, setStreetSubItem] = useState<SubItem | null>(null);
  const [streetSubItems, setStreetSubItems] = useState<MinimalStreetSub[]>([]);
  useEffect(() => {
    (async () => {
      setStreet(null);
      setStreetSubName('');
      setStreetSubItem(null);
      setStreetSubItems([]);
      if (streetId) {
        const newStreet = await getStreetDoc(streetId);
        setStreet(newStreet);
        if (newStreet.id) {
          const newSubItem = await getStreetSubItemDoc(newStreet.id);
          setStreetSubName(newSubItem.name.value);
          setStreetSubItem(newSubItem);
        }
      }
    })();
  }, [streetId]);
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
  const save = async () => {
    if (!street) return;
    const newStreet = { ...street };
    if (streetSubItem) {
      const id = await setSubItemDoc(streetSubItem);
      newStreet.subId = id;
    }
    if (street) {
      setStreetDoc(newStreet);
      setStreet(newStreet);
    }
    onSaveStreet(newStreet);
  };
  const detachSubObject = () => {
    setStreetSubName('');
    if (street) {
      setStreet({
        ...street,
        subId: null,
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
    setStreetSubItem(null);
  };
  const handleFormChange = (
    name: string,
    value: any,
    source: string | null = null,
    isCopy: boolean = false,
  ) => {
    if (name === 'typeOfName') detachSubObject();
    if (street) {
      const oldType = (street as any)[name].type;
      const oldSource = (street as any)[name].source;
      const computeType = () => {
        if (isCopy) return SourcedDataPropertyType.COPY;
        if (
          oldType === SourcedDataPropertyType.COPY ||
          oldType === SourcedDataPropertyType.COPY_EDITED
        ) {
          return SourcedDataPropertyType.COPY_EDITED;
        }
        return SourcedDataPropertyType.CUSTOM;
      };
      const type = computeType();
      setStreet({
        ...street,
        [name]: {
          ...(street as any)[name],
          value,
          source: source || oldSource,
          type,
          lastUpdate: Timestamp.fromDate(new Date()),
        },
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const handleDataPropTypeFormChange = (name: string, type: SourcedDataPropertyType) => {
    if (street) {
      setStreet({
        ...street,
        [name]: {
          ...(street as any)[name],
          type,
          lastUpdate: Timestamp.fromDate(new Date()),
        },
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const handleSubFormChange = (
    name: string,
    value: any,
    source: string | null = null,
    isCopy: boolean = false,
  ) => {
    const oldType = (streetSubItem as any)[name].type;
    const oldSource = (streetSubItem as any)[name].source;
    const computeType = () => {
      if (isCopy) return SourcedDataPropertyType.COPY;
      if (
        oldType === SourcedDataPropertyType.COPY ||
        oldType === SourcedDataPropertyType.COPY_EDITED
      ) {
        return SourcedDataPropertyType.COPY_EDITED;
      }
      return SourcedDataPropertyType.CUSTOM;
    };
    const type = computeType();
    if (streetSubItem) {
      setStreetSubItem({
        ...streetSubItem,
        [name]: {
          ...(streetSubItem as any)[name],
          value,
          source: source || oldSource,
          type,
          lastUpdate: Timestamp.fromDate(new Date()),
        },
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const specificFormParam = SUB_ITEM_MAP[street?.typeOfName?.value || 'Autre'].form;
  if (!specificFormParam) throw new Error(`Can't find the form of ${street?.typeOfName?.value}`);
  const specificForm = (
    <FormBuilder
      form={specificFormParam}
      values={streetSubItem as any}
      onValueChange={handleSubFormChange}
      onTypeChange={() => {}}
    />
  );

  return (
    <div className="flex w-full">
      {!street ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="w-1/2 p-4 relative overflow-y-auto">
            <div className="absolute right-4">
              <Button color="bg-blue-500" textColor="text-white" text="SAVE" onClick={save} />
            </div>
            <div className="flex items-center">
              <div className="w-72 h-72">
                <MapStreetViewer coords={JSON.parse(street?.coords || '[[]]')} />
              </div>
              <h1 className="pl-5 text-3xl font-bold p-1">{street?.name}</h1>
            </div>
            <div className="my-8 mx-auto w-3/4 h-1 rounded-md bg-blue-500" />
            <FormBuilder
              form={STREET_FORM_DESC}
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
                      lastUpdate: Timestamp.fromDate(new Date()),
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
                  onClick={() =>
                    setStreetSubItem({
                      ...SUB_ITEM_MAP[street.typeOfName.value].default,
                      type: street.typeOfName.value as SourcedDataPropertyType,
                    })
                  }
                />
              )}
            </div>
            {streetSubItem ? specificForm : null}
          </div>
          <div className="w-1/2 p-4 overflow-y-auto">
            <StreetFormWikiHelper
              streetName={street.name}
              copyField={(type, propName, value, source) => {
                if (type === 'main') handleFormChange(propName, value, source, true);
                handleSubFormChange(propName, value, source, true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
