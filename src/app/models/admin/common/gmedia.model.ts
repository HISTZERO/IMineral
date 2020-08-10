export class GmediaModel {
  base64: string;
  type: string;
}

export  class GmediaArrayModel {
  jsonParameter: GmediaModel[];
}

export class OutputGmediaModel {
  id: number;
  tenFile: string;
  type: string;
  toadox: number;
  toadoy: number;
  caodoz: number;
  checked: boolean;
  srid: number;
  objKey: number;
  vitri: string;
  link: string;
  tieude: string;
  thoigiankhoitao: string;
  idLoaitailieu: number;
  iconFile: string;
  tacgia: string;
  nguoiky: string;
  kieutoado: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: number;
}

export class InputGmediaModel {
  id: number;
  toadox: number;
  toadoy: number;
  caodoz: number;
  srid: number;
  objKey: number;
  vitri: string;
  link: string;
  tieude: string;
  thoigiankhoitao: string;
  idLoaitailieu: number;
  tacgia: string;
  nguoiky: string;
  note: string;
  kieutoado: string;
}

export class PreviewUrl {
  link: any[] = [];
  name: string[] = [];
}
