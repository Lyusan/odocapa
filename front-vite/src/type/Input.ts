import { Activity } from './Activity';

export type InputOnChange = (propertyName: string, newValue: string | number | Activity[]) => void;

export type InputType = 'text' | 'textarea' | 'number' | 'select' | 'activity' | 'politicScale';

export interface InputDesc {
  id: string;
  name: string;
  wikiPropName?: string;
  label: string;
  type: InputType;
  values?: string[];
}
