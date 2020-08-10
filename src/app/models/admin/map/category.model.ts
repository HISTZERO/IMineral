import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputCategoryModel implements DeserializableModel {
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

export class InputCategoryModel {
  id: number;
  parentId: number;
  catType: string;
  catOrder: number;
  catName: string;
  slug: string;
}
