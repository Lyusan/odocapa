import React from 'react';
import ClosingButton from '../component/ClosingButton';
import logo from '../assets/Odocapa_Logo_MAQ_01_Bleu.png';
import SelectButton from '../component/SelectButton';
import DataManagementPage from './ProjectPresentation/DataManagementPage';
import ProjectPage from './ProjectPresentation/ProjectPage';
import SourcesPage from './ProjectPresentation/SourcesPage';

export default function ProjectPresentation({
  version,
  onClose,
}: {
  version: 'std' | 'mobile';
  onClose: () => void;
}) {
  const [pages, setPages] = React.useState([
    {
      name: 'Projet',
      selected: true,
      page: <ProjectPage />,
    },
    {
      name: 'Traitements des données',
      selected: false,
      page: <DataManagementPage />,
    },
    {
      name: 'Sources',
      selected: false,
      page: <SourcesPage />,
    },
  ]);
  return version === 'std' ? (
    <div className="relative grid grid-cols-12 grid-rows-1 h-full w-full p-10 bg-black bg-opacity-20 z-10 rounded-[3rem]">
      <div className="absolute right-5 top-5 z-20">
        <ClosingButton size={40} onClose={onClose} />
      </div>
      <div className="col-span-5 row-span-1 flex flex-col justify-center items-center p-12">
        <img src={logo} alt="odocapa logo" />
      </div>
      <div className="h-full col-span-7 grid grid-rows-6">
        <div className="h-full z-10 flex gap-5 justify-center items-center">
          {pages.map((page) => (
            <SelectButton
              name={page.name}
              selected={page.selected}
              onClick={() => {
                setPages(
                  pages.map((p) => ({
                    ...p,
                    selected: p.name === page.name,
                  })),
                );
              }}
            />
          ))}
        </div>
        <div className="row-span-5 overflow-auto p-5">
          {pages.find((page) => page.selected)?.page}
        </div>
      </div>
    </div>
  ) : (
    <div className="relative flex flex-col h-full w-full p-4 bg-black bg-opacity-20 z-10 rounded-lg">
      <div className="absolute right-5 top-5 z-20">
        <ClosingButton size={40} onClose={onClose} />
      </div>
      <div className="flex flex-col justify-center items-center w-full grow">
        <div className="flex flex-col justify-center items-center">
          <img className="w-24" src={logo} alt="odocapa logo" />
        </div>
        <div className="py-5">
          <div className="z-10 flex gap-5 justify-center items-center">
            {pages.map((page) => (
              <SelectButton
                name={page.name}
                selected={page.selected}
                onClick={() => {
                  setPages(
                    pages.map((p) => ({
                      ...p,
                      selected: p.name === page.name,
                    })),
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-auto grow">{pages.find((page) => page.selected)?.page}</div>
    </div>
  );
}
