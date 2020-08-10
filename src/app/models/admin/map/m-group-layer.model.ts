import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputMapGroupLayerModel implements DeserializableModel {
  id: number;
  layerGroupId: number;
  groupOrder: number;
  groupType: number;
  layerName: string;
  layerTitle: string;
  description: string;
  opacity: number;
  sourceId: number;
  status: number;
  extentMinx: number;
  extentMiny: number;
  extentMaxx: number;
  extentMaxy: number;
  minResolution: number;
  maxResolution: number;
  fieldsInfo: string;
  fieldsDisplay: string;
  fieldsInfoFormat: string;
  fieldsInfoTemplate: string;
  moreSettings: string;
  tocDisplay: boolean;
  baselayer: boolean;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputMapGroupLayerModel {
  id: number;
  layerGroupId: number;
  groupOrder: number;
  groupType: number;
  layerName: string;
  layerTitle: string;
  description: string;
  opacity: number;
  sourceId: number;
  status: number;
  extentMinx: number;
  extentMiny: number;
  extentMaxx: number;
  extentMaxy: number;
  minResolution: number;
  maxResolution: number;
  fieldsInfo: string;
  fieldsDisplay: string;
  fieldsInfoFormat: string;
  fieldsInfoTemplate: string;
  moreSettings: string;
  tocDisplay: boolean;
  baselayer: boolean;
}
