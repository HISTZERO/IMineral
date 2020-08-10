import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputLayerGroupModel implements DeserializableModel {
  id: number;
  groupKey: string;
  groupName: string;
  parentId: number;
  description: string;
  groupType: number;
  status: boolean;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputLayerGroupModel {
  id: number;
  groupKey: string;
  groupName: string;
  parentId: number;
  description: string;
  groupType: number;
  status: boolean;
}
