import { NhomLoaiCapPhepEnum, ChiTietDangKyHoatDongKS } from "src/app/shared/constants/nhomloaicapphep-constants";
import { keyKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";
import { keyNhomBaoCao } from "src/app/shared/constants/nhombaocao-constants";

export class AdminRoutingName {
  // Các routes cấp 1
  public static danhmucUri = "danhmuc";
  public static adminUri = "admin";
  public static mapUri = "map";
  public static khuvuckhoangsanUri = "khuvuckhoangsan";
  public static diemquangmoquangUri = "diemquangmoquang";
  public static baocaoUri = "baocao";
  public static dangkyhoatdongkhoangsanUri = "dangkyhoatdongkhoangsan";
  public static capphephoatdongkhoangsanUri = "capphephoatdongkhoangsan";
  public static tinhtiencapquyenUri = "tinhtiencapquyen";
  public static thietlapUri = "thietlap";
  public static thuvienUri = "thuvien";
  public static tinbaiUri = "tinbai";


  public static hethongUri = "hethong";
  public static quantrac = "quantrac";
  public static danhsachtram = "danhsachtram";

  // Các routes cấp 2
  // 1.1. Routes phần danh mục
  public static canhanUri = "canhan";
  public static dvhcUri = "dvhc";
  public static capquanlyUri = "capquanly";
  public static captainguyenUri = "captainguyen";
  public static captruluongUri = "captruluong";
  public static coquanquanlyUri = "coquanquanly";
  public static loaibaocaoUri = "loaibaocao";
  public static loaicapphepUri = "loaicapphep";
  public static loaigiayphepUri = "loaigiayphep";
  public static loaikhoangsanUri = "loaikhoangsan";
  public static loaitailieuUri = "loaitailieu";
  public static loaitochucUri = "loaitochuc";
  public static nguongocmoUri = "nguongocmo";
  public static nhomkhoangsanUri = "nhomkhoangsan";
  public static thutuchanhchinhUri = "thutuchanhchinh";
  public static tochucUri = "tochuc";
  public static linhvucUri = "linhvuc";

  // 1.2 Routes phần dữ liệu bản đồ
  public static lopbandoUri = "lopbando";
  public static nhomlopbandoUri = "nhomlopbando";
  public static nhombandoUri = "nhombando";
  public static hetoadoUri = "hetoado";
  public static bandoUri = "bando";

  // 1.3 Routes báo cáo
  public static danhsach = "danhsach";
  public static thongtin = "thongtin";
  public static dieutrakhaosatUri = keyNhomBaoCao.BaoCaoDieuTraKhaoSat;
  public static baocaohoatdongdinhkyUri = keyNhomBaoCao.BaoCaoHoatDong;
  public static giamsathoatdongUri = keyNhomBaoCao.BaoCaoGiamSatHoatDong;
  public static thongtintulieuUri = keyNhomBaoCao.ThongTinTuLieu;
  public static quyhoachUri = keyNhomBaoCao.QuyHoach;

  // 1.4 Routes thiết lập
  public static ThietLapHeThong = "thietlaphethong";
  public static CauHinhTaiLieu = "cauhinhtailieu";
  public static CoQuanTiepNhan = "coquantiepnhan";
  public static CoQuanCapPhep = "coquancapphep";
  public static CoQuanBanHanh = "coquanbanhanh";

  // 1.5 Routes hệ thống
  public static hethongLog = "hethonglog";

  // 1.6 Phê duyệt
  public static PheDuyetDuLieu = "pheduyetdulieu";

  // 1.7 Dashboard
  public static dashboard = "dashboard";

  // 1.8 Routes phần Tin bài
  public static chuDe = "chude";
  public static tinTuc = "tintuc";
  // 1.8.1 Routes trang thêm, sửa dữ liệu và xem trước tin tức
  public static addTinTuc = "them";
  public static editTinTuc = "sua";
  public static reviewTinTuc = "xem";

  // 1.9 Routes phần khu vực khoáng sản
  public static khuvuccamtamcamUri = keyKhuVucKhoangSan.KhuVucCamTamCam;
  public static khuvucdaugiaUri = keyKhuVucKhoangSan.KhuVucDauGia;
  public static khuvuckhoangsandochaiUri = keyKhuVucKhoangSan.KhuVucKhoangSanDocHai;
  public static khuvuckhongdaugiaUri = keyKhuVucKhoangSan.KhuVucKhongDauGia;
  public static khuvucdutrukhoangsanUri = keyKhuVucKhoangSan.KhuVucDuTruKhoangSan;
  public static thongtinkhuvuckhoangsanUri = "thongtinkhuvuckhoangsan";

  // 1.10 Routes phần điểm quặng/mỏ quặng
  public static diemquangUri = "diemquang";

  // 1.11 Routes phần thăm dò khoáng sản
  public static dkthamdokhoangsanUri = "dkthamdokhoangsan";
  public static dkthamdokhoangsanchitietUri = "dkthamdokhoangsanchitiet";
  public static dkKhaithackhoangsanUri = "dkkhaithackhoangsan";
  public static dkKhaithackhoangsanChitiet = "dkkhaithackhoangsanchitiet";
  public static dkPheDuyetTruLuongUri = "dkpheduyettruluongkhoangsan";
  public static dkPheDuyetTruLuongChitiet = "dkpheduyettruluongkhoangsanchitiet";
  public static dkDauGiaQuyenUri = "dkdaugiaquyen";
  public static dkDauGiaQuyenChitiet = "dkdaugiaquyenchitiet";
  public static dkTanthukhoangsanUri = "dktanthukhoangsan";
  public static dkTanthukhoangsanChiTiet = "dktanthukhoangsanchitiet";
  public static dkTralaigiayphepUri = "dktralaigiayphep";
  public static dkTralaigiayphepChiTiet = "dktralaigiayphepchitiet";
  public static dkDongcuamoUri = "dkdongcuamo";
  public static dkDongcuamoChiTiet = "dkdongcuamochitiet";
  public static dkChuyennhuongquyenUri = "dkchuyennhuongquyen";
  public static dkChuyennhuongquyenChiTiet = "dkchuyennhuongquyenchitiet";

  // 1.12 Routes phần cấp phép khoáng sản
  public static cpthamdokhoangsanUri = "cpthamdokhoangsan";
  public static cpkhaithackhoangsanUri = "cpkhaithackhoangsan";
  public static cppheduyettruluongkhoangsanUri = "cppheduyettruluongkhoangsan";
  public static cptanthukhoangsanUri = "cptanthukhoangsan";
  public static cpdongcuamokhoangsanUri = "cpdongcuamokhoangsan";
  public static cpdaugiaquyenkhaithackhoangsanUri = "cpdaugiaquyenkhaithackhoangsan";
  public static cptralaigiayphepthamdokhaithackhoangsanUri = "cptralaigiayphepthamdokhaithackhoangsan";
  public static cpchuyennhuongquyenthamdokhaithackhoangsanUri = "cpchuyennhuongquyenthamdokhaithackhoangsan";
  public static cpthamdokhoangsanchitietUri = "cpthamdokhoangsanchitiet";
  public static cpkhaithackhoangsanchitietUri = "cpkhaithackhoangsanchitiet";
  public static cppheduyettruluongkhoangsanchitietUri = "cppheduyettruluongkhoangsanchitiet";
  public static cpdaugiaquyenkhaithackhoangsanchitietUri = "cpdaugiaquyenkhaithackhoangsanchitiet";
  public static cptanthukhoangsanchitietUri = "cptanthukhoangsanchitiet";
  public static cptralaigiayphepthamdokhaithackhoangsanchitietUri = "cptralaigiayphepthamdokhaithackhoangsanchitiet";
  public static cpdongcuamokhoangsanchitietUri = "cpdongcuamokhoangsanchitiet";
  public static cpchuyennhuongquyenthamdokhaithackhoangsanchitietUri = "cpchuyennhuongquyenthamdokhaithackhoangsanchitiet";
  // 1.13 Routes tính tiền cấp quyền
  public static danhsachtinhtiencapquyennUri = "danhsachtinhtiencapquyen";
  public static tinhtiencapquyenchitietnUri = "tinhtiencapquyenchitiet";
}
