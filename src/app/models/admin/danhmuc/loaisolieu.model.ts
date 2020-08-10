import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputLoaisolieuModel implements DeserializableModel {
  id: number;
  tenloaisolieu: string;
  tenviettat: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputLoaisolieuModel {
  id: number;
  tenloaisolieu: string;
  tenviettat: string;
}
