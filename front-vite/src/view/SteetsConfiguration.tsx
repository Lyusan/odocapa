import React, { useEffect, useState } from 'react';

import StreetButton from '../component/StreetButton';
import TextInput from '../component/TextInput';
import { getStreetsDocs, MinimalStreet } from '../service/firestore.service';
import StreetForm from './StreetForm';

export default function StreetsConfiguration() {
  const [streets, setStreets] = useState<MinimalStreet[]>([]);
  const [street, setStreet] = useState<MinimalStreet | null>(null);
  const [searchStreetString, setSearchStreetString] = useState<string>('');

  useEffect(() => {
    (async () => {
      setStreets(await getStreetsDocs());
    })();
  }, []);

  const onSelectStreet = async (selectedStreet: MinimalStreet) => {
    setStreet(selectedStreet);
  };

  return (
    <div className="flex full-view">
      <div className="flex-col h-full w-80 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center p-1">Streets</h1>
        <div className="flex flex-col p-1">
          <TextInput
            name="searchStreetByName"
            id="searchStreetByNameInput"
            placeholder="Search street"
            value={searchStreetString}
            onChange={(name, value) => setSearchStreetString(value)}
          />
          {streets
            .filter((s) => s.name.includes(searchStreetString))
            .map((s) => (
              <div className="py-1.5 ">
                <StreetButton
                  name={s.name}
                  lastUpdateDate={s.lastUpdate}
                  selected={s.id === street?.id}
                  onSelectStreet={() => {
                    onSelectStreet(s);
                  }}
                />
              </div>
            ))}
        </div>
      </div>
      {street ? (
        <StreetForm minimalStreet={street} />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-3xl font-bold text-center ">Select a street</h1>
        </div>
      )}
    </div>
  );
}
