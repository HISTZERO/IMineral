import { DeserializableModel } from '../deserializable.model';

export class OutputOtypeOptsModel implements DeserializableModel {
  id: number;
  otypeKey: string;
  optKey: string;
  optName: string;
  optTitle: string;
  optOrder: number;
  optType: string;
  isNull: boolean;
  typeValidate: boolean;
  nullValidate: boolean;
  isEnable: boolean;
  inList: boolean;
  inIo: boolean;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputOtypeOptsModel {
  id: number;
  otypeKey: string;
  optKey: string;
  optName: string;
  optTitle: string;
  optOrder: number;
  optType: string;
  isNull: boolean;
  typeValidate: boolean;
  nullValidate: boolean;
  isEnable: boolean;
  inList: boolean;
  inIo: boolean;
}
