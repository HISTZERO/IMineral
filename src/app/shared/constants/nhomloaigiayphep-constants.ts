import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { NhomLoaiCapPhepEnum } from 'src/app/shared/constants/nhomloaicapphep-constants';

export const NhomLoaiGiayPhep = [
    {
        id: 1,
        name: "Thăm dò khoáng sản"
    },
    {
        id: 2,
        name: "Phê duyệt trữ lượng khoáng sản"
    },
    {
        id: 3,
        name: "Đấu giá quyền khai thác khoáng sản"
    },
    {
        id: 4,
        name: "Khai thác khoáng sản"
    },
    {
        id: 5,
        name: "Tận thu khoáng sản"
    },
    {
        id: 6,
        name: "Trả lại giấy phép thăm do, khai thác"
    },
    {
        id: 7,
        name: "Đóng cửa mỏ, khoáng sản"
    },
    {
        id: 8,
        name: "Tính tiền cấp quyền"
    }
];

// export enum NhomLoaiGiayPhepEnum {
//   ThamDoKhoangSan = 1,
//   PheDuyetTruLuong = 2,
//   DauGiaQuyenKhaiThac = 3,
//   KhaiThacKhoangSan = 4,
//   TanThuKhoangSan = 5,
//   TraLaiGiayPhep = 6,
//   DongCuaMo = 7,
//   TinhTienCapQuyen = 8
// }

export const ChiTietCapPhepHoatDongKS: any = {
  [NhomLoaiCapPhepEnum.ThamDoKhoangSan]: AdminRoutingName.cpthamdokhoangsanchitietUri,
  [NhomLoaiCapPhepEnum.KhaiThacKhoangSan]: AdminRoutingName.cpkhaithackhoangsanchitietUri,
  [NhomLoaiCapPhepEnum.PheDuyetTruLuong]: AdminRoutingName.cppheduyettruluongkhoangsanchitietUri,
  [NhomLoaiCapPhepEnum.DauGiaQuyenKhaiThac]: AdminRoutingName.cpdaugiaquyenchitietUri,
  [NhomLoaiCapPhepEnum.TanThuKhoangSan]: AdminRoutingName.cptanthukhoangsanchitietUri,
  [NhomLoaiCapPhepEnum.TraLaiGiayPhep]: AdminRoutingName.cptralaigiayphepchitietUri,
  [NhomLoaiCapPhepEnum.DongCuaMo]: AdminRoutingName.cpdongcuamokhoangsanchitietUri,
  [NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac]: AdminRoutingName.cpchuyennhuongquyenchitietUri,
};
