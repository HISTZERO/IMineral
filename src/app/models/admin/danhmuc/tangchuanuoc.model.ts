import { DeserializableModel } from "../deserializable.model";

export class OutputTangchuanuocModel implements DeserializableModel {
  id: number;
  tentangchuanuoc: string;
  kieutangchuanuoc: string;
  hesotrunuoc: number;
  hesotham: number;
  bedaytangchua: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputTangchuanuocModel {
  id: number;
  tentangchuanuoc: string;
  kieutangchuanuoc: string;
  hesotrunuoc: number;
  hesotham: number;
  bedaytangchua: number;
}
