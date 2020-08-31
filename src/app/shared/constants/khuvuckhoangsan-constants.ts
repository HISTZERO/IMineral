import { KhuvuccamTamcamChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";
import { KhuvuckhoangsandochaiChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-chitiet/khuvuckhoangsandochai-chitiet.component";



export class keyKhuVucKhoangSan {
    public static KhuVucCamTamCam = 'khuvuccamtamcam';
    public static KhuVucKhoangSanDocHai = 'khuvuckhoangsandochai';
}

export const detailComponentKhuVucKhoangSan: any = {
    [keyKhuVucKhoangSan.KhuVucCamTamCam]: KhuvuccamTamcamChitietComponent,
    [keyKhuVucKhoangSan.KhuVucKhoangSanDocHai]: KhuvuckhoangsandochaiChitietComponent
}