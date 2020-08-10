import { DeserializableModel } from "../deserializable.model";

export class OutputNhomthamsoModel implements DeserializableModel {
  id: number;
  tennhom: string;
  kyhieunhom: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputNhomthamsoModel {
  id: number;
  tennhom: string;
  kyhieunhom: string;
}
