import { DangkykhaithacgiahanIoComponent } from "../../features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacgiahan-io/dangkykhaithacgiahan-io.component";
import { DangkykhaithackhoangsanIoComponent } from "../../features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsan-io/dangkykhaithackhoangsan-io.component";
import { TrangThai } from "./trangthai-constants";
export enum InsertedState {
  SaveAndRefresh = 1,
  SaveAndEdit = 2
}

export enum SelectedOptionType {
  Popup = 1,
  NoPopup = 2
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

export enum NhomLoaiCapPhepEnum {
  ThamDoKhoangSan = 1,
  PheDuyetTruLuong = 2,
  DauGiaQuyenKhaiThac = 3,
  KhaiThacKhoangSan = 4,
  TanThuKhoangSan = 5,
  TraLaiGiayPhep = 6,
  DongCuaMo = 7,
  ChuyenNhuongThamDoKhaiThac = 8
}

export enum LoaiCapPhepEnum {
  ThamDoKhoangSan = "3",
  ThamDoGiaHan = "4",
  KhaiThacKhoangSan = "9",
  KhaiThacKhoangSanGiaHan = "10",
  DieuChinhGiayPhapKhaiThac = "11",
  KhaiThacKhoangSanCoDuAnDauTu = "15",
  KhaiThacKhoangSanLamVatLieuXayDung = "16",
  ThuHoiCatSoiDuAnNaoVetKhoiThong = "17"
}

export enum NhomTaiLieuEnum {
  TaiLieuBatBuoc = 1,
  TaiLieuKhongBatBuoc = 2,
  TaiLieuXuLyHoSo = 3
}

export enum TrangThaiCauHinh {
  ChuaCauHinh = 0,
  DaCauHinh = 1
}

export enum LoaiDoiTuongEnum {
  CaNhan = 1,
  ToChuc = 2
}

export enum HoSoActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyThamDoActionEnum {
  None = 0,
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

export enum DangKhoangSanEnum {
  KhoangSanRan = 1,
  KhoangSanNuocNong = 2
}

export enum DangKyThamDoKhoangSanTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucThamDo = 3,
  CongTrinhThamDo = 4
}
