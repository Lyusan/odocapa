export type InputOnChange = (propertyName: string, newValue: string) => void;

export type InputType = 'text' | 'textarea' | 'select';

export interface InputDesc {
  id: string;
  name: string;
  label: string;
  type: InputType;
  values?: string[];
}
