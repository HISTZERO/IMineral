import { KhuvuccamTamcamChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";
import { KhuvuckhoangsandochaiChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-chitiet/khuvuckhoangsandochai-chitiet.component";
import { KhuvucdutrukhoangsanChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdutrukhoangsan/khuvucdutrukhoangsan-chitiet/khuvucdutrukhoangsan-chitiet.component";
import { KhuvucdaugiaChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdaugia/khuvucdaugia-chitiet/khuvucdaugia-chitiet.component";
import { KhuvuckhongdaugiaChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhongdaugia/khuvuckhongdaugia-chitiet/khuvuckhongdaugia-chitiet.component";



export class keyKhuVucKhoangSan {
    public static KhuVucCamTamCam = 'khuvuccamtamcam';
    public static KhuVucKhoangSanDocHai = 'khuvuckhoangsandochai';
    public static KhuVucDuTruKhoangSan = 'khuvucdutrukhoangsan';
    public static KhuVucDauGia = 'khuvucdaugia';
    public static KhuVucKhongDauGia = 'khuvuckhongdaugia';
}

export const nameKhuVucKhoangSan: any = {
    [keyKhuVucKhoangSan.KhuVucCamTamCam]: "Khu vực cấm & tạm cấm",
    [keyKhuVucKhoangSan.KhuVucKhoangSanDocHai]: "Khu vực khoáng sản độc hại",
    [keyKhuVucKhoangSan.KhuVucDuTruKhoangSan]: "Khu vực dự trữ khoáng sản",
    [keyKhuVucKhoangSan.KhuVucDauGia]: "Khu vực đấu giá",
    [keyKhuVucKhoangSan.KhuVucKhongDauGia]: "Khu vực không đấu giá"
};

export const detailComponentKhuVucKhoangSan: any = {
    [keyKhuVucKhoangSan.KhuVucCamTamCam]: KhuvuccamTamcamChitietComponent,
    [keyKhuVucKhoangSan.KhuVucKhoangSanDocHai]: KhuvuckhoangsandochaiChitietComponent,
    [keyKhuVucKhoangSan.KhuVucDuTruKhoangSan]: KhuvucdutrukhoangsanChitietComponent,
    [keyKhuVucKhoangSan.KhuVucDauGia]: KhuvucdaugiaChitietComponent,
    [keyKhuVucKhoangSan.KhuVucKhongDauGia]: KhuvuckhongdaugiaChitietComponent
};

export const KhuVucKhoangSan = [
  {
      id: 1,
      name: "Khu vực cấm"
  },
  {
      id: 2,
      name: "Khu vực tạm cấm"
  },
  {
      id: 3,
      name: "Khu vực đấu giá"
  },
  {
    id: 4,
    name: "Khu vực không đấu giá"
  },
  {
    id: 5,
    name: "Khu vực khoáng sản độc hại"
  },
  {
    id: 6,
    name: "Khu vực dự trữ khoáng sản"
  }
];

export enum KhuVucKhoangSanEnum {
  KhuVucCam = 1,
  KhuVucTamCam = 2,
  KhuVucDauGia = 3,
  KhuVucKhongDauGia = 4,
  KhuVucKhoangSanDocHai = 5,
  KhuVucDuTruKhoangSan = 6
}

export enum MaLoaiHinhEnum {
  KhuVucCam = 1,
  KhuVucTamCam = 2
}
