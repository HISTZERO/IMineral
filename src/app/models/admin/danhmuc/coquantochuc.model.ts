import { DeserializableModel } from "../deserializable.model";

// for get
export class OutputCoquantochucModel implements DeserializableModel {
  id: number;
  idcha: number;
  tencoquan: string;
  diachi: string;
  sodienthoai: string;
  email: string;
  matinh: string;
  mahuyen: string;
  maxa: string;
  note: string;
  imgLink: string;
  children?: OutputCoquantochucModel[];

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
// for insert update
export class InputCoquantochucModel {
  id: number;
  idcha: number;
  tencoquan: string;
  diachi: string;
  sodienthoai: string;
  email: string;
  matinh: string;
  mahuyen: string;
  maxa: string;
  note: string;
  imgLink: string;
}
