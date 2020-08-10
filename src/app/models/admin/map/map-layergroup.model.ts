import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputMapLayerGroupModel implements DeserializableModel {
  id: number;
  mapId: number;
  laygroupId: number;
  status: number;
  mapLayerGroupName: string;
  layerGroupParentId: number;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputMapLayerGroupModel {
  id: number;
  mapId: number;
  laygroupId: number;
  status: number;
  mapLayerGroupName: string;
  layerGroupParentId: number;
}
