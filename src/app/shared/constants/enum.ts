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

// export enum NhomLoaiCapPhepEnum {
//   ThamDoKhoangSan = 1,
//   PheDuyetTruLuong = 2,
//   DauGiaQuyenKhaiThac = 3,
//   KhaiThacKhoangSan = 4,
//   TanThuKhoangSan = 5,
//   TraLaiGiayPhep = 6,
//   DongCuaMo = 7,
//   ChuyenNhuongThamDoKhaiThac = 8
// }

export enum LoaiCapPhepEnum {
  DauGiaQuyenKhaiThacKhoangSanKhuVucChuaThamDo = "1",
  DauGiaQuyenKhaiThacKhoangSanKhuVucDaThamDo = "2",
  ThamDoKhoangSan = "3",
  ThamDoGiaHan = "4",
  PheDuyetTruLuongKhoangSan = "5",
  TraLaiMotPhanDienTichKhuVucThamDoKhoangSan = "6",
  TraLaiGiayPhepThamDoKhoangSan = "7",
  ChuyenNhuongQuyenThamDoKhoangSan = "8",
  KhaiThacKhoangSan = "9",
  KhaiThacKhoangSanGiaHan = "10",
  DieuChinhGiayPhepKhaiThac = "11",
  TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan = "12",
  TraLaiGiayPhepKhaiThacKhoangSan = "13",
  ChuyenNhuongQuyenKhaiThacKhoangSan = "14",
  KhaiThacKhoangSanCoDuAnDauTu = "15",
  KhaiThacKhoangSanLamVatLieuXayDung = "16",
  ThuHoiCatSoiDuAnNaoVetKhoiThong = "17",
  KhaiThacTanThuKhoangSan = "18",
  KhaiThacTanThuKhoangSanGiaHan = "19",
  TraLaiGiayPhepTanThuKhoangSan = "20",
  DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan = "21",
  DongCuaMoKhoangSan = "22",
  ChapThuanKhaoSatLayMau = "23",
  TinhTienCapQuyen = "24"
}
export enum ActionDataEnum{
  None = 0,
  Add = 1,
  Edit = 2
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

export enum LoaiVanBanEnum {
  GiayPhep = 1,
  QuyetDinh = 2,
  BanXacNhan = 3,
  VanBanTuChoi = 4
}

export enum HoSoActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum GiayPhepActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyThamDoActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyKhaiThacKsActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyKhaiThacTraLaiActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyTanThuTraLaiActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyThamDoTraLaiActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum DangKyTraLaiGiayPhepActionEnum {
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

export enum KhaiThacKhoangSanTabEnum {
  ThongTinHoSo = 0,
  TaiLieuHoSoDinhKem = 1,
  TaiLieuXuLyHoSoDinhKem = 2,
  ThongTinDangKy = 3
}

export enum TraLaiGiayPhepTabEnum {
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
  CongTrinhThamDo = 4,
  BanDoKhuVuc = 5,
}

export enum DangKyKhaiThacKhoangSanTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucKhaiThac = 3,
  CongTrinhKhaiThac = 4,
  ThietBi = 5
}

export enum DangKyPheDuyetTruLuongTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucKhaiThac = 3,
  CongTrinhKhaiThac = 4,
  ThietBi = 5
}


export enum DangKyDauGiaKTKSTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucKhaiThac = 3,
  CongTrinhKhaiThac = 4,
  ThietBi = 5
}

export enum DangKyTraLaiGiayPhepTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVuc = 3,
  CongTrinh = 4,
}

export enum DangKyTanThuKhoangSanTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucTanThu = 3,
}

export enum DangKyDongCuaMoTabEnum {
  ThongTinChiTiet = 0,
  KhuVucKhaiThac = 1,
  DonViHanhChinh = 2,
  LoaiKhoangSan = 3,
  CongTrinhKhaiThac = 4,
}

export enum CpThamDoKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}

export enum CpKhaiThacKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}

export enum CpPheDuyetTruLuongKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}
export enum CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum{
  ThongTinChiTiet=0,
  LoaiKhoangSan=1,
  TruLuongKhuVuc=2,
  KhoiLuongTruLuong=3
}
export enum CpPheDuyetTLKS_LoaiKhoangSan_PhanLoai{
  KhoangSanChinh=1,
  KhoangSanDiKem=2
}

export enum CpTanThuKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}


export enum CpDongCuaMoKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}

export enum CpDauGiaQuyenKhaiThacKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}


export enum CpTraLaiGiayPhepThamDoKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}

export enum CpChuyenNhuongQuyenThamDoKhoangSanTabEnum {
  ThongTinGiayPhep = 0,
  TaiLieuGiayPhepDinhKem = 1,
  ThongTinCapPhep = 2
}

export enum CpThamDoKhoangSanTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucThamDo = 3,
  CongTrinhThamDo = 4
}

export enum CpTanThuKhoangSanTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucTanThu = 3,
}

export enum CpKhaiThacKhoangSanChiTietTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucKhaiThac = 3,
  CongTrinhKhaiThac = 4,
  ThietBiKhaiThac = 5
}

export enum CpDongCuaMoChiTietTabEnum {
  ThongTinChiTiet = 0,
  KhuVucDongCuaMo = 1,
}

export enum CapPhepThamDoActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum CpChuyenNhuongThamDoKhaiThacChiTietTabEnum {
  ThongTinChiTiet = 0,
  DonViHanhChinh = 1,
  LoaiKhoangSan = 2,
  KhuVucKhaiThac = 3,
  CongTrinhKhaiThac = 4,
  ThietBiKhaiThac = 5
}

export enum TinhTienCapQuyenKhaiThacKhoangSanTabEnum {
  ThongTinQuyeDinh = 0,
  TaiLieuDinhKem = 1,
  ThongTinTinhTienHangNam = 2
}

export enum TinhTienCapQuyenKhaiThacKhoangSanActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum CapPhepKhaiThacActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}

export enum CpChuyenNhuongThamDoKhaiThacActionEnum {
  None = 0,
  Add = 1,
  Edit = 2
}


