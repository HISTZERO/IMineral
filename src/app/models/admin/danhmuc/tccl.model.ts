import { DeserializableModel } from "src/app/models/admin/deserializable.model";

export class OutputTieuchuanchatluongModel implements DeserializableModel {
  id: number;
  idTieuchuan: number;
  tentieuchuan: string;
  idThamso: number;
  tenthamso: string;
  idDonvido: number;
  gioihantren: number;
  gioihanduoi: number;
  phuongphapthu: string;
  captieuchuan: string;
  mucdogiamsat: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}

export class InputTieuchuanchatluongModel {
  id: number;
  idTieuchuan: number;
  idThamso: number;
  idDonvido: number;
  gioihantren: number;
  gioihanduoi: number;
  phuongphapthu: string;
  captieuchuan: string;
  mucdogiamsat: string;
}
