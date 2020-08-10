import { DeserializableModel } from "../deserializable.model";

export class OutputTieuchuanModel implements DeserializableModel {
  id: number;
  sohieutieuchuan: string;
  tentieuchuan: string;
  thoigianbanhanh: string;
  coquanbanhanh: string;
  hientrang: string;
  tailieuLink: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputTieuchuanModel {
  id: number;
  sohieutieuchuan: string;
  tentieuchuan: string;
  thoigianbanhanh: string;
  coquanbanhanh: string;
  hientrang: string;
  tailieuLink: string;
}
