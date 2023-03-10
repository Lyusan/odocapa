import React from 'react';
import { Category, CategoryValue } from '../type/Category';
import ColorPicker from './ColorPicker';
import Select from './Select';

interface LegendProps {
  categorie: Category;
  onSelectValueCategories: (cv: CategoryValue[]) => void;
  selectedValueCategories: CategoryValue[];
}

export default function Legend({
  categorie,
  onSelectValueCategories,
  selectedValueCategories,
}: LegendProps) {
  const onsetSelectValueCategories = (cv: CategoryValue, isAlreadySelected: boolean) => {
    // if (categorie.select === 'single') return isAlreadySelected ? [] : [cv];
    if (selectedValueCategories.length === categorie.values.length) return [cv];
    return isAlreadySelected
      ? selectedValueCategories.filter((scv) => scv.name !== cv.name)
      : selectedValueCategories.concat(cv);
  };
  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-main-blue">{categorie.name}</h1>
        <div
          className="cursor-pointer pl-6"
          onClick={() => {
            onSelectValueCategories(
              selectedValueCategories.length === categorie.values.length ? [] : categorie.values,
            );
          }}
        >
          <ColorPicker
            color="#322783"
            size={20}
            selected={selectedValueCategories.length > 0}
            scale={selectedValueCategories.length === categorie.values.length ? 'full' : 'half'}
            shape="circle"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-auto">
        {categorie.values.map((categoryValue) => {
          const isSelected = !!selectedValueCategories.find(
            (scv) => scv.name === categoryValue.name,
          );
          return (
            <Select
              isSelected={isSelected}
              name={categoryValue.name}
              color={categoryValue.color}
              onSelect={() =>
                onSelectValueCategories(onsetSelectValueCategories(categoryValue, isSelected))
              }
            />
          );
        })}
      </div>
    </div>
  );
}
