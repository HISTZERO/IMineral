import { DeserializableModel } from '../deserializable.model';

export class OutputObjKeyModel implements DeserializableModel {
  id: number;
  objTable: string;
  note: string;
  objKey: number;
  serviceName: string;
  objName: string;
  moduleName: string;
  fieldsInfo: string;
  fieldsDisplay: string;
  status: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputObjKeyModel {
  id: number;
  objTable: string;
  note: string;
  objKey: number;
  objName: string;
  serviceName: string;
  moduleName: string;
  fieldsInfo: string;
  fieldsDisplay: string;
  status: number;
}
