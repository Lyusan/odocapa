import { Activity } from './Activity';

export type InputOnChange = (propertyName: string, newValue: string | Activity[]) => void;

export type InputType = 'text' | 'textarea' | 'select' | 'activity';

export interface InputDesc {
  id: string;
  name: string;
  label: string;
  type: InputType;
  values?: string[];
}
