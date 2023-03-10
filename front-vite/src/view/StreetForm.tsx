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
import { MinimalSubItem, SUB_ITEM_MAP, TypeOfName } from '../type/SubItem';
import { SourcedDataPropertyType } from '../type/SourcedDataProperty';
import SubItemSelector from '../component/SubItemSelector';
import { getWikiPersonInfo, getWikiSearch, getWikiStreetInfo } from '../service/wiki.service';
import Modal from '../component/Modal';
import { formatStreetName } from '../helper/street';

interface StreetFormProp {
  streetId: string | null;
  onSaveStreet: (street: Street) => void;
}

export default function StreetForm({ streetId, onSaveStreet }: StreetFormProp) {
  const [street, setStreet] = useState<Street | null>(null);
  const [streetSubItems, setStreetSubItems] = useState<MinimalSubItem[]>([]);
  const [streetWikiPages, setStreetWikiPages] = useState<any[]>([]);
  const [displayParisDataInfo, setDisplayParisDataInfo] = useState<boolean>();

  useEffect(() => {
    (async () => {
      setStreet(null);
      setStreetSubItems([]);
      if (streetId) {
        const newStreet = await getStreetDoc(streetId);
        setStreet(newStreet);
        setStreetWikiPages(await getWikiSearch(newStreet.name));
      }
      const items = await getStreetSubItemsDocs();
      setStreetSubItems(items);
    })();
  }, [streetId]);
  const save = async () => {
    if (!street) return;
    const newStreet = { ...street };

    newStreet.subIds = await Promise.all(
      newStreet.subItems.map((subItem) => setSubItemDoc(subItem)),
    );

    if (street) {
      setStreetDoc(newStreet);
      setStreet(newStreet);
    }
    onSaveStreet(newStreet);
  };

  const detachSubItem = (itemIndex: number) => {
    if (street) {
      setStreet({
        ...street,
        subIds: street.subIds.filter((_, index) => index !== itemIndex),
        subItems: street.subItems.filter((_, index) => index !== itemIndex),
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const createSubItem = async (type: TypeOfName) => {
    if (street) {
      setStreet({
        ...street,
        subItems: [...street.subItems, { ...SUB_ITEM_MAP[type].default, type }],
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const attachSubItem = async (itemId: string) => {
    if (street) {
      setStreet({
        ...street,
        subIds: [...street.subIds, itemId],
        subItems: [...street.subItems, await getStreetSubItemDoc(itemId)],
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const handleFormChange = (
    name: string,
    value: any,
    source: string | null = null,
    isCopy: boolean = false,
  ) => {
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
    subItemIndex: number,
    name: string,
    value: any,
    source: string | null = null,
    isCopy: boolean = false,
  ) => {
    if (!street) return;
    const subItem = street.subItems[subItemIndex];
    const oldType = (subItem as any)[name].type;
    const oldSource = (subItem as any)[name].source;
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
    if (subItem) {
      const newSubItem = {
        ...subItem,
        [name]: {
          ...(subItem as any)[name],
          value,
          source: source || oldSource,
          type,
          lastUpdate: Timestamp.fromDate(new Date()),
        },
        lastUpdate: Timestamp.fromDate(new Date()),
      };
      setStreet({
        ...street,
        subItems: street.subItems.map((si, index) => (index === subItemIndex ? newSubItem : si)),
        lastUpdate: Timestamp.fromDate(new Date()),
      });
    }
  };
  const subItemsForms = street?.subItems?.map((subItem, index) => (
    <>
      <div className="col-start-1">
        <Button
          color="bg-red-400"
          text="Détacher l'object"
          onClick={() => {
            detachSubItem(index);
          }}
        />
        <FormBuilder
          form={SUB_ITEM_MAP[subItem.type].form}
          values={subItem}
          onValueChange={(propertyName, newValue) =>
            handleSubFormChange(index, propertyName, newValue)
          }
          onTypeChange={() => {}}
        />
      </div>
      <div className="col-start-2 p-4">
        <StreetFormWikiHelper
          form={SUB_ITEM_MAP[subItem.type].form}
          listOfPage={streetWikiPages}
          copyField={(propName, value, source) => {
            handleSubFormChange(index, propName, value, source, true);
          }}
          fetchData={getWikiPersonInfo}
        />
      </div>
      <div className="col-span-2 my-8 mx-auto w-3/4 h-1 rounded-md bg-main-blue" />
    </>
  ));

  return (
    <div className="grid grid-cols-2 w-full full-view">
      {!street ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="p-4 relative">
            <div className="flex items-center">
              <div className="w-1/2 h-60">
                <MapStreetViewer coords={JSON.parse(street?.coords || '[[]]')} />
              </div>
              <h1 className="pl-5 text-3xl p-1">{formatStreetName(street.name)}</h1>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="absolute flex gap-2 right-4 top-4">
              <Button size="md" text="info" onClick={() => setDisplayParisDataInfo(true)} />
              <Button
                size="md"
                color="bg-main-blue"
                textColor="text-white"
                text="save"
                onClick={save}
              />
              {displayParisDataInfo ? (
                <Modal title="info" onClose={() => setDisplayParisDataInfo(false)}>
                  <ul className="list-disc">
                    {Object.entries(street.parisDataInfo)
                      .filter((e) => e[0] !== 'coords')
                      .sort((e1, e2) => (e1[0] > e2[0] ? 1 : -1))
                      .map(([st, el]) => (
                        <li>{`${st}: ${el}`}</li>
                      ))}
                  </ul>
                </Modal>
              ) : null}
            </div>
            <h1 className="col-start-2 text-3xl">Wikipedia helper</h1>
          </div>
          <div className="col-span-2 grid grid-cols-2 w-full overflow-y-auto">
            <div className="col-span-2 my-8 mx-auto w-3/4 h-1 rounded-md bg-main-blue" />
            <div className="col-start-1">
              <FormBuilder
                form={STREET_FORM_DESC}
                values={street}
                onValueChange={handleFormChange}
                onTypeChange={handleDataPropTypeFormChange}
              />
            </div>
            <div className="col-start-2 p-4">
              <StreetFormWikiHelper
                form={STREET_FORM_DESC}
                listOfPage={streetWikiPages}
                copyField={(propName, value, source) => {
                  handleFormChange(propName, value, source, true);
                }}
                fetchData={getWikiStreetInfo}
              />
            </div>
            <div className="col-span-2 my-8 mx-auto w-3/4 h-1 rounded-md bg-main-blue" />
            {subItemsForms}
            <div className="col-span-2">
              <SubItemSelector
                subItems={streetSubItems}
                attachSubItem={attachSubItem}
                createSubItem={createSubItem}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
