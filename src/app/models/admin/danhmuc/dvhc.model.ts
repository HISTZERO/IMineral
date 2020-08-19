import { DeserializableModel } from '../deserializable.model';
// output model
export class OutputDmDvhcModel implements DeserializableModel {
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
export class InputDmDvhcModel {
  id: number;
  tendvhc: string;
  parentid: number;
  matinh: string;
  mahuyen: string;
  maxa: string;
}
