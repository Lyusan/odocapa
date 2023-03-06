import React, { useContext, useEffect, useRef, useState } from 'react';
import Legend from '../component/Legend';
import MapOdocapa from '../component/Map/MapOdocapa';
import { CATEGORIES_DESC, CategoryValue } from '../type/Category';
import CategorySelector from '../component/CategorieSelector';
import { getStreetDoc, getStreetsDocs } from '../service/firestore.service';
import { Street } from '../type/Street';
import StatModal from '../component/StatModal';
import { formatStreetName } from '../helper/street';
import AnalyticsButton from '../component/AnalyticsButton';
import SideCard from '../component/SideCard';
import SideCardStreet from '../component/SideCardStreet';
import UserContext from '../context/UserContext';
import MultiRangeSlider from '../component/MultiRangeSlider';

export default function StreetsConfiguration() {
  const { currentUser } = useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES_DESC[0]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<CategoryValue[]>(
    CATEGORIES_DESC[0].values,
  );
  const [streets, setStreets] = useState<Street[]>([]);
  const [filteredStreets, setFilteredStreets] = useState<Street[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const [hoverStreet, setHoverStreet] = useState<Street | null>(null);
  const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);
  const [displayStats, setDisplayStats] = useState(false);

  const [borderDate, setBorderDate] = useState({
    minValue: 1,
    maxValue: 2023,
    min: 1,
    max: 2023,
    minThumb: 0,
    maxThumb: 0,
  });

  useEffect(() => {
    if (selectedCategory) {
      setSelectedSubCategories(
        selectedCategory.select === 'multiple'
          ? selectedCategory.values
          : [selectedCategory.values[0]],
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    (async () => {
      const newStreets = await getStreetsDocs();
      setStreets(newStreets);
      setFilteredStreets(newStreets);
    })();
  }, []);
  const mapRef = useRef(null);
  const setDisplay = async (streetId: string | null, stat = false) => {
    if (!streetId) setSelectedStreet(null);
    else setSelectedStreet(await getStreetDoc(streetId));
    setDisplayStats(stat);
  };

  useEffect(() => {
    setFilteredStreets(
      streets.filter((s) => {
        const regexp = /[0-9]{4}/g;
        if (!s.parisDataInfo.naming) return false;
        const array = [...s.parisDataInfo.naming.matchAll(regexp)];
        if (array.length === 0) return false;
        const date = Number(array[array.length - 1]);
        return borderDate.minValue <= date && date <= borderDate.maxValue;
      }),
    );
  }, [borderDate]);

  if (!currentUser) return <div>Not logged in</div>;
  return (
    <div className="w-full h-screen">
      <div className="grid grid-cols-12 grid-rows-layout z-10 h-full">
        <div className="col-span-7 z-10 flex my-auto h-7 justify-center items-center">
          {CATEGORIES_DESC.map((c) => (
            <CategorySelector
              categorie={c}
              selected={selectedCategory.name === c.name}
              onCategorieClick={(categorie) => {
                setSelectedCategory(categorie);
                // setSelectedSubCategory(null);
              }}
              key={c.name}
            />
          ))}
        </div>

        <div className="col-span-5 mx-4 z-10 h-fit mt-4 flex gap-2">
          <div className="w-18 h-18">
            <AnalyticsButton onAnalytics={() => setDisplay(null, true)} />
          </div>
          <div className="w-full">
            <input
              value={searchString}
              onChange={(e) => {
                if (e.target.value) setDisplay(null, false);
                setSearchString(e.target.value);
              }}
              type="string"
              placeholder="Recherche une rue, une place..."
              className="w-full px-3.5 py-1 rounded-full border-2 border-black shadow focus:outline-none focus:shadow-sm focus:shadow-slate-200 duration-100 shadow-gray-100"
            />
            {searchString ? (
              <ul className="w-full">
                {filteredStreets
                  .filter((s) => s.name.toLowerCase().includes(searchString.toLowerCase()))
                  .slice(0, 5)
                  .map((s) => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                      key={s.id}
                      className="w-full cursor-pointer text-gray-700 p-4 mt-2 bg-white"
                      onClick={() => {
                        (mapRef?.current as any).zoomOnStreet(s);
                        setDisplay(s.id, false);
                        setSearchString('');
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className="col-span-7 z-10 p-2 text-xl relative m-auto">
          {hoverStreet ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center">
                <svg
                  width="90"
                  height="49"
                  viewBox="0 0 90 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M88 21V47H2V21H6.28205C9.17304 21 11.9595 19.9188 14.0939 17.9689L19.8045 12.7517C36.2886 -2.3078 62.0753 -0.273678 75.9943 17.1841C77.9169 19.5955 80.833 21 83.917 21H88Z"
                    fill="white"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                </svg>

                <div className="text-sm -translate-y-11 z-20">
                  {hoverStreet.parisDataInfo.district[0].replace(/$0/, '')}
                </div>
                <div className=" w-fit h-fit p-4 -translate-y-11 bg-white border-black border-2 z-20 text-center transition-all duration-300 whitespace-nowrap">
                  {hoverStreet.parisDataInfo.type?.toUpperCase()}
                  <br />
                  {`${
                    hoverStreet.parisDataInfo.prepositionStreet?.toUpperCase() || ''
                  } ${hoverStreet.parisDataInfo.nameStreet?.toUpperCase()}`}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {selectedStreet || displayStats ? (
          <div
            className="col-start-8 row-span-5 col-span-5 m-4 mt-0 max-h-full bg-white rounded-2xl border-2 border-black z-10"
            style={{ maxHeight: 'calc(100% - 1rem)' }}
          >
            <SideCard
              title={selectedStreet ? formatStreetName(selectedStreet.name) : 'Statistiques'}
              onClose={() => {
                setDisplay(null, false);
              }}
              child={
                selectedStreet ? (
                  <SideCardStreet street={selectedStreet} />
                ) : (
                  <StatModal streets={filteredStreets} category={selectedCategory} />
                )
              }
            />
          </div>
        ) : null}
      </div>
      <div className="absolute left-0 top-0 bg-slate-100 h-full w-full">
        <MapOdocapa
          ref={mapRef}
          streets={filteredStreets}
          onStreetSelect={setDisplay}
          categorie={selectedCategory}
          categoryValues={selectedSubCategories}
          onStreetHover={(streetId) =>
            setHoverStreet(filteredStreets.find((s) => s.id === streetId) ?? null)
          }
          selectedStreet={selectedStreet}
        />
      </div>
      <div className="absolute left-5 bottom-5 py-2.5 px-5 bg-white rounded-lg shadow-2xl">
        <Legend
          categorie={selectedCategory}
          selectedValueCategories={selectedSubCategories}
          onSelectValueCategories={setSelectedSubCategories}
        />
      </div>
      <div className="absolute w-1/2 left-[400px] bottom-5 py-2.5 px-5 bg-white rounded-lg shadow-2xl">
        <div className="flex justify-center items-center">
          <MultiRangeSlider range={borderDate} changeRange={setBorderDate} />
        </div>
      </div>
    </div>
  );
}
