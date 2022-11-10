/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Activity } from '../type/Activity';
import { InputDesc, InputOnChange } from '../type/Input';
import { SourcedDataProperty, SourcedDataPropertyType } from '../type/SourcedDataProperty';
import ActivitySelector from './ActivitySelector';
import BaseLabelInput from './BaseLabelInput';
import BaseSelect from './BaseSelect';
import ButtonDataPropertyType from './ButtonDataPropertyType';
import DateMomentAgo from './DateMomentAgo';
import Link from './Link';
import TextInput from './TextInput';

interface SwitchInputProp {
  inputDesc: InputDesc;
  value: SourcedDataProperty<string> | SourcedDataProperty<Activity[]>;
  onValueChange: InputOnChange;
  onTypeChange: (name: string, type: SourcedDataPropertyType) => void;
}

function SwitchInput({ inputDesc, value, onValueChange, onTypeChange }: SwitchInputProp) {
  let input: any = null;
  switch (inputDesc.type) {
    case 'activity':
      input = (
        <ActivitySelector
          activities={value.value as Activity[]}
          onChange={(activities) => onValueChange(inputDesc.name, activities)}
        />
      );
      break;
    case 'select':
      input = (
        <BaseSelect
          name={inputDesc.name}
          value={value.value as string}
          values={inputDesc.values!}
          onChange={onValueChange}
        />
      );
      break;
    case 'text':
    case 'textarea':
      input = (
        <TextInput
          id={inputDesc.id}
          type={inputDesc.type}
          name={inputDesc.name}
          value={value.value}
          onChange={onValueChange}
        />
      );
      break;
    default:
      input = <div>{`Type ${inputDesc.type} is not supported`}</div>;
      break;
  }
  return (
    <BaseLabelInput
      inputId={inputDesc.id}
      label={inputDesc.label}
      componentRightLabel={
        value.type ? (
          <ButtonDataPropertyType
            type={value.type}
            onClick={(type) => onTypeChange(inputDesc.name, type)}
          />
        ) : null
      }
    >
      {input}
      <div className="flex justify-between">
        {value.source ? <Link link={value.source} /> : null}
        <p className="text-gray-400 ml-auto">
          {value.lastUpdate ? <DateMomentAgo date={value.lastUpdate} /> : <br />}
        </p>
      </div>
    </BaseLabelInput>
  );
}

interface FormBuilderProp {
  form: InputDesc[];
  values: any;
  onValueChange: InputOnChange;
  onTypeChange: (name: string, type: SourcedDataPropertyType) => void;
}

export default function FormBuilder({
  form,
  values,
  onValueChange,
  onTypeChange,
}: FormBuilderProp) {
  return (
    <div className="flex flex-col">
      {form.map((element) => (
        <div className="my-2" key={element.id}>
          <SwitchInput
            inputDesc={element}
            value={values[element.name]}
            onValueChange={onValueChange}
            onTypeChange={onTypeChange}
          />
        </div>
      ))}
    </div>
  );
}
