import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputProjectionModel implements DeserializableModel {
  id: number;
  prjName: string;
  srid: number;
  proj4Params: string;
  extent: string;
  status: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputProjectionModel {
  id: number;
  prjName: string;
  srid: number;
  proj4Params: string;
  extent: string;
  status: number;
}
