import React from 'react';
import { InputDesc, InputOnChange } from '../type/Input';
import BaseLabelInput from './BaseLabelInput';
import BaseSelect from './BaseSelect';
import TextInput from './TextInput';

interface SwitchInputProp {
  inputDesc: InputDesc;
  value: any;
  onChange: InputOnChange;
}

function SwitchInput({ inputDesc, value, onChange }: SwitchInputProp) {
  switch (inputDesc.type) {
    case 'select':
      return (
        <BaseLabelInput inputId={inputDesc.id} label={inputDesc.label}>
          <BaseSelect
            name={inputDesc.name}
            value={value as string}
            values={inputDesc.values!}
            onChange={onChange}
          />
        </BaseLabelInput>
      );
    case 'text':
    case 'textarea':
      return (
        <BaseLabelInput inputId={inputDesc.id} label={inputDesc.label}>
          <TextInput
            id={inputDesc.id}
            type={inputDesc.type}
            name={inputDesc.name}
            value={value}
            onChange={onChange}
          />
        </BaseLabelInput>
      );
    default:
      return <div>{`Type ${inputDesc.type} is not supported`}</div>;
  }
}

interface FormBuilderProp {
  form: InputDesc[];
  values: any;
  onChange: InputOnChange;
}

export default function FormBuilder({ form, values, onChange }: FormBuilderProp) {
  return (
    <div className="flex flex-col">
      {form.map((element) => (
        <div className="my-2">
          <SwitchInput
            key={element.id}
            inputDesc={element}
            value={values[element.name]}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
}
