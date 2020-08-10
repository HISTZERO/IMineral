import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputMapModel implements DeserializableModel {
  id: number;
  objKey: string;
  categories: string;
  mapTitle: string;
  mapSlug: string;
  mapAbstract: string;
  extentMinx: number;
  extentMiny: number;
  extentMaxx: number;
  extentMaxy: number;
  center: string;
  unit: number;
  sizeX: string;
  sizeY: string;
  projectionId: number;
  webMinscale: number;
  webMaxscale: number;
  zoomLevel: number;
  refImageLink: string;
  status: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputMapModel {
  id: number;
  objKey: string;
  categories: string;
  mapTitle: string;
  mapSlug: string;
  mapAbstract: string;
  extentMinx: number;
  extentMiny: number;
  extentMaxx: number;
  extentMaxy: number;
  center: string;
  unit: number;
  sizeX: string;
  sizeY: string;
  projectionId: number;
  webMinscale: number;
  webMaxscale: number;
  zoomLevel: number;
  refImageLink: string;
  status: number;
}
