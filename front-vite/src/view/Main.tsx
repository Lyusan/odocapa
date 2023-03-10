import React, { useEffect, useRef, useState } from 'react';
import Legend from '../component/Legend';
import MapOdocapa from '../component/Map/MapOdocapa';
import { CATEGORIES_DESC, CAT_DISTRICT, CategoryValue } from '../type/Category';
import SelectButton from '../component/SelectButton';
import { getStreetDoc, getStreetsDocs } from '../service/firestore.service';
import { Street } from '../type/Street';
import StatModal from '../component/StatModal';
import { formatStreetName } from '../helper/street';
import AnalyticsButton from '../component/AnalyticsButton';
import SideCard from '../component/SideCard';
import SideCardStreet from '../component/SideCardStreet';
import MultiRangeSlider from '../component/MultiRangeSlider';
import SearchInput from '../component/SearchInput';
import ClosingButton from '../component/ClosingButton';
import ColorPicker from '../component/ColorPicker';
import NavigationControl from '../component/Map/NavigationControl';
import Select from '../component/Select';
import ProgressBar from '../component/ProgressBar';
import logo from '../assets/Odocapa_Logo_MAQ_01_Bleu.png';

export default function Main() {
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
  const [displayMain, setDisplayMain] = useState(true);
  const [displayFilters, setDisplayFilters] = useState(false);
  const [filters, setFilters] = useState({
    includeIfNoDataForNamingDate: true,
    district: CAT_DISTRICT.map((d) => ({
      value: d.name.length === 2 ? `0${d.name}` : d.name,
      label: d.name,
      isSelected: true,
    })),
  });
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
      setSelectedSubCategories(selectedCategory.values);
    }
  }, [selectedCategory]);

  function getDateYear(date: string | null) {
    if (!date) return null;
    const regexp = /[0-9]{4}/g;
    const array = [...date.matchAll(regexp)];
    if (array.length === 0) return null;
    return Number(array[array.length - 1]);
  }

  useEffect(() => {
    (async () => {
      const newStreets = await getStreetsDocs();
      setStreets(newStreets);
      const min = Math.min(
        ...(newStreets
          .map((s) => getDateYear(s.parisDataInfo.naming))
          .filter((n) => n !== null) as number[]),
      );
      const max = Math.max(
        ...(newStreets
          .map((s) => getDateYear(s.parisDataInfo.naming))
          .filter((n) => n !== null) as number[]),
      );
      setBorderDate({ minValue: min, maxValue: max, min, max, minThumb: 0, maxThumb: 0 });
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
    if (!displayMain) {
      setFilteredStreets([]);
      return;
    }
    setFilteredStreets(
      streets
        .filter((s) => {
          const regexp = /[0-9]{4}/g;
          if (!s.parisDataInfo.naming) return filters.includeIfNoDataForNamingDate;
          const array = [...s.parisDataInfo.naming.matchAll(regexp)];
          if (array.length === 0) return filters.includeIfNoDataForNamingDate;
          const date = Number(array[array.length - 1]);
          return borderDate.minValue <= date && date <= borderDate.maxValue;
        })
        .filter((s) => {
          if (filters.district.length === 0) return true;
          return filters.district.some((d) => {
            const res = d.isSelected && s.parisDataInfo.district.includes(d.value);
            return res;
          });
        }),
    );
  }, [borderDate, filters, displayMain]);

  function setFilterDistrict(d: any) {
    setFilters({
      ...filters,
      district: filters.district.map((cd) => {
        if (d.value === cd.value) return { ...cd, isSelected: !cd.isSelected };
        return cd;
      }),
    });
  }

  function setFilterDistrictAll() {
    setFilters({
      ...filters,
      district:
        filters.district.reduce((acc, d) => acc + (d.isSelected ? 1 : 0), 0) ===
        filters.district.length
          ? filters.district.map((d) => ({ ...d, isSelected: false }))
          : filters.district.map((d) => ({ ...d, isSelected: true })),
    });
  }
  return (
    <div className="w-full h-screen relative">
      {displayMain ? (
        <div className="w-full h-screen relative">
          <div className="grid grid-cols-12 grid-rows-layout z-10 h-full">
            <div
              className="col-span-1 z-10 p-3 flex my-auto h-full justify-center items-center gap-3 cursor-pointer"
              onClick={() => setDisplayMain(false)}
            >
              <img className="max-h-full max-w-full" src={logo} alt="odocapa logo" />
            </div>
            <div className="col-span-8 z-10 flex my-auto h-7 justify-center items-center gap-3">
              {CATEGORIES_DESC.filter((c) => !c.secondary).map((c) => (
                <SelectButton
                  name={c.name}
                  selected={selectedCategory.name === c.name}
                  onClick={() => {
                    setSelectedCategory(c);
                  }}
                  key={c.name}
                />
              ))}
            </div>

            <div className="col-span-3 mx-4 z-10 gap-2 h-full flex items-center">
              <div className="w-18 h-18">
                <AnalyticsButton onAnalytics={() => setDisplay(null, true)} />
              </div>
              <div className="w-full">
                <SearchInput
                  value={searchString}
                  onChange={(str) => {
                    if (str) setDisplay(null, false);
                    setSearchString(str);
                  }}
                />
              </div>
            </div>
            <div className="col-span-1 p-2 text-xl relative">
              <div className="absolute left-5 z-10">
                <NavigationControl
                  zoomIn={() => {
                    (mapRef?.current as any).zoomIn();
                  }}
                  zoomOut={() => {
                    (mapRef?.current as any).zoomOut();
                  }}
                />
              </div>
            </div>
            <div className="col-span-6 z-10 p-2 text-xl relative m-auto">
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
                        stroke="#322783"
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

            {searchString && (
              <div className="col-start-10 row-span-5 col-span-3 z-10 m-4 mt-0 max-h-full h-fit overflow-auto mb-20">
                <ul className="w-full h-full">
                  {filteredStreets
                    .filter((s) => s.name.toLowerCase().includes(searchString.toLowerCase()))
                    .map((s) => (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={s.id}
                        className="w-full cursor-pointer text-sm  px-2 py-1 mt-2 bg-white border border-main-blue rounded-full"
                        onClick={() => {
                          (mapRef?.current as any).zoomOnStreet(s);
                          setDisplay(s.id, false);
                          setSearchString('');
                        }}
                      >
                        {formatStreetName(s.name)}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {(selectedStreet || displayStats) && (
              <div
                className="col-start-8 row-span-5 col-span-5 z-10 m-4 mt-0"
                style={{ height: 'calc(100% - 1rem)' }}
              >
                <div className="h-full bg-white rounded-2xl overflow-auto p-6">
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
              </div>
            )}
          </div>
          <div className="absolute left-5 bottom-5 py-2.5 px-5 bg-white rounded-2xl shadow-2xl max-h-[75%] z-10 overflow-auto">
            <Legend
              categorie={selectedCategory}
              selectedValueCategories={selectedSubCategories}
              onSelectValueCategories={setSelectedSubCategories}
            />
          </div>
          {displayFilters ? (
            <div className="absolute w-1/3 left-[300px] bottom-5 py-2.5 px-5 bg-white rounded-2xl shadow-2xl z-10">
              <div className="flex justify-between pb-5">
                <h1 className="text-lg">Filtres</h1>
                <ClosingButton onClose={() => setDisplayFilters(false)} />
              </div>
              <ProgressBar max={streets.length} value={filteredStreets.length} />
              <div className="flex pt-3 justify-between">
                <h2 className="pb-3">Arrondissements:</h2>
                <div className="cursor-pointer" onClick={() => setFilterDistrictAll()}>
                  <ColorPicker selected={filters.district.every((d) => d.isSelected)} size={20} />
                </div>
              </div>
              <div className="flex gap-4 pb-3 w-full flex-wrap ">
                {filters.district.map((d) => (
                  <Select
                    name={d.label}
                    size="sm"
                    isSelected={d.isSelected}
                    onSelect={() => setFilterDistrict(d)}
                  />
                ))}
              </div>
              <h2 className="pb-5">Date de dénomination:</h2>
              <div className="flex flex-col gap-4">
                <Select
                  name="Inclure quand la date est inconnu"
                  size="sm"
                  isSelected={filters.includeIfNoDataForNamingDate}
                  onSelect={() =>
                    setFilters({
                      ...filters,
                      includeIfNoDataForNamingDate: !filters.includeIfNoDataForNamingDate,
                    })
                  }
                />
                <MultiRangeSlider range={borderDate} changeRange={setBorderDate} />
              </div>
            </div>
          ) : (
            <div
              className="absolute w-1/3 left-[300px] bottom-5 py-2.5 px-5 bg-white rounded-2xl shadow-2xl z-10 cursor-pointer flex gap-4"
              onClick={() => setDisplayFilters(true)}
            >
              <h1>Filtres</h1>
              <ProgressBar max={streets.length} value={filteredStreets.length} />
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-full w-full p-20 z-10">
          <div className="relative grid grid-cols-2 grid-rows-1 h-full w-full p-10 bg-black bg-opacity-20 z-10 rounded-[3rem]">
            <div className="absolute right-5 top-5 z-20">
              <ClosingButton size={40} onClose={() => setDisplayMain(true)} />
            </div>
            <div className="col-span-1 row-span-1 flex flex-col justify-center items-center p-12">
              <img src={logo} alt="odocapa logo" />
            </div>
            <div className="h-full grid grid-rows-6">
              <div className="h-full z-10 flex gap-5 justify-center items-center">
                <SelectButton
                  name="Projet"
                  selected
                  onClick={() => {
                    console.log('click');
                  }}
                  key="project"
                />
                <SelectButton
                  name="Future"
                  selected={false}
                  onClick={() => {
                    console.log('click');
                  }}
                  key="future"
                />
                <SelectButton
                  name="Sources"
                  selected={false}
                  onClick={() => {
                    console.log('click');
                  }}
                  key="sources"
                />
                <SelectButton
                  name="Auteur"
                  selected={false}
                  onClick={() => {
                    console.log('click');
                  }}
                  key="author"
                />
              </div>
              <p className="h-full overflow-auto row-span-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id mi laoreet, mollis
                neque id, condimentum leo. Sed lobortis mi a aliquet interdum. Ut interdum hendrerit
                pharetra. In enim nulla, rhoncus sed erat nec, viverra placerat tortor. Pellentesque
                bibendum gravida sollicitudin. Morbi sed sollicitudin est. Maecenas mollis pharetra
                metus sed porta. Quisque a semper nunc, sed gravida nulla. Quisque euismod, sapien
                ac venenatis efficitur, sapien quam volutpat quam, non tempor elit mauris sed
                mauris.
                <br />
                <br />
                Proin in elit viverra, viverra dui et, maximus augue. Praesent ac pharetra nunc.
                Proin et elit nec enim aliquam euismod. Etiam tempus in ipsum vitae efficitur.
                Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam rhoncus sed nibh
                hendrerit facilisis. Integer elementum consectetur nisl, sit amet mattis risus
                eleifend ut.
                <br />
                <br />
                Proin in elit viverra, viverra dui et, maximus augue. Praesent ac pharetra nunc.
                Proin Quisque scelerisque varius dui, ut placerat justo pellentesque eu. Suspendisse
                dapibus felis lacinia eros volutpat, eu aliquet turpis suscipit. Phasellus eget
                tempor dui, sit amet malesuada lorem. Phasellus ipsum tellus, euismod nec lorem nec,
                porta pharetra magna. Duis blandit, ante id sodales vestibulum, felis mauris egestas
                nisi, id facilisis quam ex egestas sapien. Aenean vel eros felis. Suspendisse nec
                orci tortor. Vivamus sit amet eros cursus, facilisis eros vel, placerat nulla.
                Nullam feugiat diam neque. Donec tellus mauris, eleifend ut erat vel, posuere
                condimentum tortor. Etiam vitae justo ac ex porta gravida sit amet et urna. Ut
                accumsan nunc sem, vitae dictum diam faucibus id. Donec ac suscipit orci. Aliquam id
                est sit amet odio pretium pellentesque a id leo. Sed egestas mi condimentum ipsum
                dictum, sed tristique velit finibus. Morbi ex neque, rhoncus id faucibus sit amet,
                auctor in quam. Nunc elementum tincidunt erat, id consequat velit aliquet vel.
                Curabitur at erat vulputate velit rutrum lacinia sed nec neque. Nam scelerisque,
                lectus a tempor tempor, justo mauris tincidunt tellus, gravida malesuada ex velit
                eget purus. In at mi eros.
                <br />
                <br />
                Proin eu posuere nunc, vel bibendum sem. Nunc nisi arcu, facilisis non sagittis
                pharetra, lacinia quis elit. Curabitur rhoncus commodo nibh, ut malesuada odio
                tincidunt venenatis. Cras consectetur, lacus ut maximus commodo, nulla justo
                consequat lectus, eu molestie sem risus ac augue. Aenean ut sollicitudin purus, id
                viverra ipsum. Nam porttitor nisi non nunc ultricies, sit amet mattis lorem
                ullamcorper. Morbi ullamcorper suscipit finibus. Pellentesque in tortor ante.
                Maecenas nulla justo, lacinia sed nibh ac, condimentum tristique est. Sed porta
                suscipit ipsum, eu condimentum lorem maximus et. Maecenas nec vestibulum tortor.
                Aliquam ut erat porttitor, posuere mauris vitae, luctus eros. Integer aliquam turpis
                vel nibh dignissim sagittis.
              </p>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}
