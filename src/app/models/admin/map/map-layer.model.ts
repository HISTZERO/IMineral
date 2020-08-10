import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputMapLayerModel implements DeserializableModel {
  id: number;
  mapId: number;
  mapOrder: number;
  layerGroupId: number;
  groupOrder: number;
  groupType: number;
  layerType: string;
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
  baselayer: boolean;
  fieldsInfo: string;
  fieldsDisplay: string;
  fieldsInfoFormat: string;
  fieldsInfoTemplate: string;
  moreSettings: string;
  legendEnabled: boolean;
  tocDisplay: boolean;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputMapLayerModel {
  id: number;
  mapId: number;
  mapOrder: number;
  layerGroupId: number;
  groupOrder: number;
  groupType: number;
  layerType: string;
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
  baselayer: boolean;
  fieldsInfo: string;
  fieldsDisplay: string;
  fieldsInfoFormat: string;
  fieldsInfoTemplate: string;
  moreSettings: string;
  legendEnabled: boolean;
  tocDisplay: boolean;
}
