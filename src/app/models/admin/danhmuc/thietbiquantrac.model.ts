import { DeserializableModel } from "../deserializable.model";

export class OutputThietbiquantracModel implements DeserializableModel {
  id: number;
  ten: string;
  hangsanxuat: string;
  model: string;
  phuongphapqt: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputThietbiquantracModel {
  id: number;
  ten: string;
  hangsanxuat: string;
  model: string;
  phuongphapqt: string;
}
