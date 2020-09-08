import { keyKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";
import { keyNhomBaoCao } from "../shared/constants/nhombaocao-constants";

export class AdminRoutingName {
  // Các routes cấp 1
  public static danhmucUri = "danhmuc";
  public static adminUri = "admin";
  public static mapUri = "map";
  public static khuvuckhoangsanUri = "khuvuckhoangsan";
  public static diemquangmoquangUri = "diemquangmoquang";
  public static baocaoUri = "baocao";
  public static dangkyhoatdongkhoangsanUri = "dangkyhoatdongkhoangsan";
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
  public static dieutrakhaosatUri = keyNhomBaoCao.BaoCaoDieuTraKhaoSat;
  public static baocaohoatdongdinhkyUri = keyNhomBaoCao.BaoCaoHoatDong;

  // 1.4 Routes thiết lập
  public static ThietLapHeThong = "thietlaphethong";
  public static ThietLapTram = "thietlaptram";
  public static ThietLapDuLieu = "thietlapdulieu";
  public static DoiTuongTram = "doituongtram";
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
  public static thamdokhoangsanUri = "thamdokhoangsan";
}
