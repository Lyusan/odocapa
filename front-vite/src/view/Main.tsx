import React, { useEffect, useRef, useState } from 'react';
import Legend from '../component/Legend';
import MapOdocapa from '../component/Map/MapOdocapa';
import { CATEGORIES } from '../type/Categorie';
import CategorieSelector from '../component/CategorieSelector';
import { getStreetDoc, getStreetsDocs } from '../service/firestore.service';
import { SuperStreet } from '../type/Street';
import StreetCard from '../component/StreetCard';
import StatModal from '../component/StatModal';
import Button from '../component/Button';

export default function StreetsConfiguration() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [streets, setStreets] = useState<SuperStreet[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const [selectedStreetId, setSelectedStreetId] = useState<string | null>(null);
  const [selectedStreet, setSelectedStreet] = useState<SuperStreet | null>(null);
  const [displayStats, setDisplayStats] = useState(false);
  useEffect(() => {
    (async () => {
      if (!selectedStreetId) setSelectedStreet(null);
      else setSelectedStreet(await getStreetDoc(selectedStreetId));
    })();
  }, [selectedStreetId]);
  useEffect(() => {
    (async () => {
      const newStreets = await getStreetsDocs();
      setStreets(newStreets);
    })();
  }, []);
  const mapRef = useRef(null);
  return (
    <div className="w-full h-screen">
      <div className="absolute left-0 top-0 bg-slate-100 h-full w-full">
        <MapOdocapa
          ref={mapRef}
          streets={streets}
          onStreetSelect={setSelectedStreetId}
          categorie={selectedCategory}
        />
      </div>
      <div className="flex z-10 h-full">
        <div className="h-7 w-7/12 m-5 z-10 flex justify-center items-center">
          {CATEGORIES.map((c) => (
            <CategorieSelector
              categorie={c}
              selected={selectedCategory.name === c.name}
              onCategorieClick={(categorie) => setSelectedCategory(categorie)}
              key={c.name}
            />
          ))}
        </div>

        <div className="w-5/12 m-5 z-10">
          <div className="w-full mb-5">
            <input
              value={searchString}
              onChange={(e) => {
                if (e.target.value) setSelectedStreet(null);
                setSearchString(e.target.value);
              }}
              type="string"
              placeholder="Recherche une rue, une place..."
              className="py-3 px-4 w-full rounded-lg shadow focus:outline-none focus:shadow-sm focus:shadow-slate-200 duration-100 shadow-gray-100"
            />

            {searchString ? (
              <ul className="w-full">
                {streets
                  .filter((s) => s.name.toLowerCase().includes(searchString.toLowerCase()))
                  .slice(0, 5)
                  .map((s) => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      key={s.id}
                      className="w-full cursor-pointer text-gray-700 p-4 mt-2 bg-white"
                      onClick={() => {
                        (mapRef?.current as any).zoomOnStreet(s);
                        setSelectedStreet(s);
                        setSearchString('');
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
          {selectedStreet ? (
            <div
              className="max-h-full bg-white rounded-lg overflow-auto"
              style={{ maxHeight: 'calc(100% - 4.2rem)' }}
            >
              <StreetCard street={selectedStreet} onClose={() => setSelectedStreet(null)} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute left-5 bottom-5 py-2.5 px-5 bg-white rounded-lg">
        <Legend categorie={selectedCategory} />
      </div>
      {!displayStats ? (
        <div className="absolute right-1/2 left-1/2 bottom-5">
          <Button
            text={displayStats ? 'Cacher les statistiques' : 'Afficher les statistiques'}
            onClick={() => setDisplayStats(true)}
            color="bg-blue-500"
            textColor="text-white"
          />
        </div>
      ) : null}
      {displayStats && streets && selectedCategory ? (
        <StatModal
          streets={streets}
          category={selectedCategory}
          onClose={() => setDisplayStats(false)}
        />
      ) : null}
    </div>
  );
}
