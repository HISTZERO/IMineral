import { DeserializableModel } from '../deserializable.model';

export class OutputObjTypesModel implements DeserializableModel {
  id: number;
  otypeName: string;
  otypeKey: string;
  otypeCat: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputObjTypesModel {
  id: number;
  otypeName: string;
  otypeKey: string;
  otypeCat: string;
}
