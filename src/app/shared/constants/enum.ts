import { TrangThai } from "./trangthai-constants";
export enum InsertedState {
  SaveAndRefresh = 1,
  SaveAndEdit = 2
}

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

export enum LoaiDoiTuongEnum {
  CaNhan = 1,
  ToChuc = 2
}

export enum HoSoActionEnum {
  Add = 1,
  Edit = 2
}

export enum ThongTinKhoangSanTabEnum {
  ThongTinChung = 0,
  ToaDo = 1
}

export enum ThamDoKhoangSanTabEnum {
  ThongTinHoSo = 0,
  TaiLieuHoSoDinhKem = 1,
  TaiLieuXuLyHoSoDinhKem = 2,
  ThongTinDangKy = 3
}
