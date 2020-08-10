import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputDuanModel implements DeserializableModel {
  idProject: number;
  projectCode: string;
  projectName: string;
  signedDate: string;
  signedAgency: string;
  completeDate: string;
  projectLeader: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputDuanModel {
  idProject: number;
  projectCode: string;
  projectName: string;
  signedDate: string;
  signedAgency: string;
  completeDate: string;
  projectLeader: string;
}
