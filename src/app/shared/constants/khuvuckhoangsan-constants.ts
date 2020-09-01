import { KhuvuccamTamcamChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";
import { KhuvuckhoangsandochaiChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-chitiet/khuvuckhoangsandochai-chitiet.component";
import { KhuvucdutrukhoangsanChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdutrukhoangsan/khuvucdutrukhoangsan-chitiet/khuvucdutrukhoangsan-chitiet.component";



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
}

export const detailComponentKhuVucKhoangSan: any = {
    [keyKhuVucKhoangSan.KhuVucCamTamCam]: KhuvuccamTamcamChitietComponent,
    [keyKhuVucKhoangSan.KhuVucKhoangSanDocHai]: KhuvuckhoangsandochaiChitietComponent,
    [keyKhuVucKhoangSan.KhuVucDuTruKhoangSan]: KhuvucdutrukhoangsanChitietComponent
}