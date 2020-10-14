import { OutputTtTinhTienTheoNamModel } from './tttientheonam.model';

export class OutputTtTinhTienCapQuyenModel {
  idtinhtiencapquyen: string;
  giatinhtienlandau: string;
  tongtienphainop: number;
  solannop: number;
  sotienhangnam: number;
  sotienlandau: number;
  namnoplandau: number;
  idgiayphep: string;
  sogiayphep: string;
  ngaycapphep: Date;
  coquancapphep: string;
  sogiayphepls: string;
  siteid: string;
  listtinhtientheonam: OutputTtTinhTienTheoNamModel[] = [];
}

export class InputTtTinhTienCapQuyenModel {
  idtinhtiencapquyen: string;
  giatinhtienlandau: string;
  tongtienphainop: number;
  solannop: number;
  sotienhangnam: number;
  sotienlandau: number;
  namnoplandau: number;
  idgiayphep: string;
  siteid: string;
}

