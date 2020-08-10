import { DeserializableModel } from "../deserializable.model";

export class OutputThamsoModel implements DeserializableModel {
  id: number;
  tenthamso: string;
  kyhieuthamso: string;
  idNhomthamso: number;
  idDonvidomacdinh: number;
  donvidomacdinh: string;
  tennhomthamso: string;
  tagArray: any;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputThamsoModel {
  id: number;
  tenthamso: string;
  kyhieuthamso: string;
  idNhomthamso: number;
  idDonvidomacdinh: number;
  tag: any;
}
