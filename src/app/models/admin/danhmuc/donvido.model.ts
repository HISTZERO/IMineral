import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputDonvidoModel implements DeserializableModel {
  id: number;
  tendovido: string;
  kyhieudonvido: string;
  idNhomdonvido: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputDonvidoModel {
  id: number;
  tendovido: string;
  kyhieudonvido: string;
  idNhomdonvido: number;
}
