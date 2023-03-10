import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../component/ProgressBar';

import StreetButton from '../component/StreetButton';

import { getStreetsDocs } from '../service/firestore.service';
import { MinimalStreet } from '../type/Street';
import StreetForm from '../view/StreetForm';
import UserContext from '../context/UserContext';
import SearchInput from '../component/SearchInput';

export default function Admin() {
  const { currentUser } = useContext(UserContext);

  const [streets, setStreets] = useState<MinimalStreet[]>([]);
  const [searchStreetString, setSearchStreetString] = useState<string>('');
  const { streetId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setStreets(await getStreetsDocs());
    })();
  }, []);

  if (!currentUser) return <div>Not logged in</div>;
  if (!currentUser.isAdmin) return <div>You should be an admin to access this page</div>;
  return (
    <div className="grid grid-cols-12 full-view">
      <div className="grid full-view col-span-3 w-full">
        <div className="flex flex-col p-1 w-full">
          <h1 className="text-3xl text-center mb-1">Streets</h1>
          <div className="my-2">
            <ProgressBar
              value={streets.filter((s) => !!s.lastUpdate).length}
              max={streets.length}
            />
          </div>
          <SearchInput
            value={searchStreetString}
            onChange={(newValue) => setSearchStreetString(newValue)}
          />
        </div>
        <div className="flex flex-col p-1 overflow-y-scroll">
          {streets
            .filter((s) => s.name.includes(searchStreetString))
            .map((s) => (
              <div className="py-1.5" key={s.id}>
                <StreetButton
                  name={s.name}
                  lastUpdateDate={s.lastUpdate}
                  selected={s.id === streetId}
                  onSelectStreet={() => {
                    navigate(`/admin/${s.id}`);
                  }}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="grid full-view col-span-9">
        {streetId ? (
          <StreetForm
            streetId={streetId || null}
            onSaveStreet={(s) => {
              setStreets(
                streets.map((cStreet) => {
                  if (cStreet.id === streetId) {
                    return { ...cStreet, lastUpdate: s.lastUpdate };
                  }
                  return cStreet;
                }),
              );
            }}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-3xl text-center ">Select a street</h1>
          </div>
        )}
      </div>
    </div>
  );
}
