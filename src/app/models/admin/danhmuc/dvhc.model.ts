import { DeserializableModel } from '../deserializable.model';
// output model
export class OutputDvhcModel implements DeserializableModel {
  id: number;
  tendvhc: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

// input model
export class InputDvhcModel {
  id: number;
  tendvhc: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;
}
