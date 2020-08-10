import { DeserializableModel } from "../deserializable.model";

export class OutputThietLapHeThongModel implements DeserializableModel {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputThietLapHeThongModel {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;
}
