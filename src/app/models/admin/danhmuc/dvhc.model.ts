import { DeserializableModel } from '../deserializable.model';
// output model
export class OutputDmDvhcModel implements DeserializableModel {
  id: string;
  ten: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;
  tentinh: string;
  tenhuyen: string;
  tenxa: string;
  trangthai: number;
  thutu: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

// input model
export class InputDmDvhcModel {
  id: string;
  ten: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;
  trangthai: number;
  thutu: number;
}
