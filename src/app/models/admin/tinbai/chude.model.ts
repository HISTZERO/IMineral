import { DeserializableModel } from "../deserializable.model";

export class OutputChudeModel implements DeserializableModel {
  id: number;
  parentId: number;
  catType: string;
  catOrder: number;
  catName: string;
  slug: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputChudeModel {
  id: number;
  parentId: number;
  catType: string;
  catOrder: number;
  catName: string;
  slug: string;
}
