import { DeserializableModel } from "../deserializable.model";

export class OutputCongtyModel implements DeserializableModel {
  id: number;
  tencongty: string;
  diachi: string;
  sodienthoai: string;
  email: string;
  note: string;
  imgLink: string;
  tentinh: string;
  tenhuyen: string;
  tenxa: string;
  matinh: string;
  mahuyen: string;
  maxa: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputCongtyModel {
  id: number;
  tencongty: string;
  diachi: string;
  sodienthoai: string;
  email: string;
  note: string;
  imgLink: string;
  matinh: string;
  mahuyen: string;
  maxa: string;
}
