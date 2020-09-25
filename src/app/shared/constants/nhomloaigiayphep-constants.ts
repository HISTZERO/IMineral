import { AdminRoutingName } from 'src/app/routes/admin-routes-name';

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

export enum NhomLoaiGiayPhepEnum {
  ThamDoKhoangSan = 1,
  PheDuyetTruLuong = 2,
  DauGiaQuyenKhaiThac = 3,
  KhaiThacKhoangSan = 4,
  TanThuKhoangSan = 5,
  TraLaiGiayPhep = 6,
  DongCuaMo = 7,
  TinhTienCapQuyen = 8
}

export const ChiTietCapPhepHoatDongKS: any = {
  [NhomLoaiGiayPhepEnum.ThamDoKhoangSan]: AdminRoutingName.cpThamdokhoangsanchitietUri,
  [NhomLoaiGiayPhepEnum.KhaiThacKhoangSan]: AdminRoutingName.cpKhaithackhoangsanChitiet,
  [NhomLoaiGiayPhepEnum.PheDuyetTruLuong]: AdminRoutingName.cpPheDuyetTruLuongChitiet,
  [NhomLoaiGiayPhepEnum.DauGiaQuyenKhaiThac]: AdminRoutingName.cpDauGiaQuyenChitiet,
  [NhomLoaiGiayPhepEnum.TanThuKhoangSan]: AdminRoutingName.cpTanthukhoangsanChiTiet,
  [NhomLoaiGiayPhepEnum.TraLaiGiayPhep]: AdminRoutingName.cpTralaigiayphepChiTiet,
  [NhomLoaiGiayPhepEnum.DongCuaMo]: AdminRoutingName.cpDongcuamoChiTiet,
  [NhomLoaiGiayPhepEnum.TinhTienCapQuyen]: AdminRoutingName.cpTinhTienCapQuyenChiTiet,
};
