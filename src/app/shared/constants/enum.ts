import { TrangThai } from "./trangthai-constants";

export enum donvido {
  m = 0,
  cm ,
  mol,
  l,
}

export enum TrangThaiEnum {
  Created = 0,
  Active = 1,
  NoActive = 2
}

export enum Paging {
  PageNumber = 1,
  PageSize = -1
}

export enum NhomBaoCaoEnum {

}

export enum NhomLoaiCapPhep {
  ThamDoKhoangSan = 1,
  PheDuyetTruLuong = 2,
  DauGiaQuyenKhaiThac = 3,
  KhaiThacKhoangSan = 4,
  TanThuKhoangSan = 5,
  TraLaiGiayPhep = 6,
  DongCuaMo = 7,
  ChuyenNhuongThamDoKhaiThac = 8
}

export enum TrangThaiCauHinh {
  ChuaCauHinh = 0,
  DaCauHinh = 1
}