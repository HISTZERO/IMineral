export class ObjKey {
  public static GiengQuantrac = 1;
  public static GiengKhaiThac = 3;
  public static DiemXaThai = 6;
  public static KhaiThacNuocMat = 5;
  public static TramQuanTracNDD = 2;
  public static TramQuanTracNM = 4;
  public static TramBom = 7;
  public static TramKttv = 23;
  public static TramKtBeMat = 24;
  public static TramKtNongNghiep = 25;
  public static TramKtTrenCao = 26;
  public static TramRadaThoiTiet = 27;
  public static TramThuyVan = 28;
  public static TramHaiVan = 29;
  public static CongTrinhKhac = 99;
}

export const objectKeyWithName = {
  kttv: "Khí tượng thủy văn",
};

objectKeyWithName["kttv"];

export class ObjKeyArray {
  public static ArrayObj = [
    {
      name: "Giếng quan trắc",
      value: ObjKey.GiengQuantrac,
      service: "getWrGiengquantracService",
    },
    {
      name: "Giếng khai thác",
      value: ObjKey.GiengKhaiThac,
      service: "getWrGiengkhaithacService",
    },
    {
      name: "Điểm xả thải",
      value: ObjKey.DiemXaThai,
      service: "getSwXaNuocThaiService",
    },
    {
      name: "Điểm khai thác nước mặt",
      value: ObjKey.KhaiThacNuocMat,
      service: "getSwKhaithacnuocmatService",
    },
    {
      name: "Trạm quan trắc nước dưới đất",
      value: ObjKey.TramQuanTracNDD,
      service: "getWrTramquantracService",
    },
    { name: "Trạm bơm", value: ObjKey.TramBom, service: "getSwTrambomService" },
    {
      name: "Quan trắc nước mặt",
      value: ObjKey.TramQuanTracNM,
      service: "getWrQuantracnuocmatService",
    },
  ];
}

export const KiHieuThamSo = {
  KTTV_TOCDOGIO: "kttv_tocdogio",
  KTTV_BOCHOI: "kttv_bochoi",
  KTTV_DOMAN: "kttv_doman",
  KTTV_NUOCLU: "kttv_nuoclu",
  LUONGMUANGAY: "luong_mua_ngay",
  DOAMKHONGKHITHUCDO: "do_am_khongkhi_thucdo",
  NHIETDOKHONGKHITHUCDO: "nhiet_do_khongkhi_thucdo",
  DOAMKHONGKHITRUNGBINH: "do_am_khongkhi_tuongdoi_tb",
  NHIETDOKHONGKHITRUNGBINHNGAY: "nhiet_do_khong_khi",
};
