import { DeserializableModel } from '../deserializable.model';
// output model
export class OutputDmDvhcModel implements DeserializableModel {
  id: number;
  ten: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;
  trangthai: number;
  thutu: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

// input model
export class InputDmDvhcModel {
  id: number;
  ten: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;
  trangthai: number;
  thutu: number;
}
