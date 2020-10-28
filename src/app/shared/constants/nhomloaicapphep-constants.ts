import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export class NhomLoaiCapPhepEnum {
    public static ThamDoKhoangSan = 1;
    public static PheDuyetTruLuong = 2;
    public static DauGiaQuyenKhaiThac = 3;
    public static KhaiThacKhoangSan = 4;
    public static TanThuKhoangSan = 5;
    public static TraLaiGiayPhep = 6;
    public static DongCuaMo = 7;
    public static ChuyenNhuongThamDoKhaiThac = 8;
    public static TinhTienCapQuyen = 10;
}

export const ChiTietDangKyHoatDongKS: any = {
    [NhomLoaiCapPhepEnum.ThamDoKhoangSan]: AdminRoutingName.dkthamdokhoangsanchitietUri,
    [NhomLoaiCapPhepEnum.KhaiThacKhoangSan]: AdminRoutingName.dkKhaithackhoangsanChitiet,
    [NhomLoaiCapPhepEnum.PheDuyetTruLuong]: AdminRoutingName.dkPheDuyetTruLuongChitiet,
    [NhomLoaiCapPhepEnum.DauGiaQuyenKhaiThac]: AdminRoutingName.dkDauGiaQuyenChitiet,
    [NhomLoaiCapPhepEnum.TanThuKhoangSan]: AdminRoutingName.dkTanthukhoangsanChiTiet,
    [NhomLoaiCapPhepEnum.TraLaiGiayPhep]: AdminRoutingName.dkTralaigiayphepChiTiet,
    [NhomLoaiCapPhepEnum.DongCuaMo]: AdminRoutingName.dkDongcuamoChiTiet,
    [NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac]: AdminRoutingName.dkChuyennhuongquyenChiTiet,
};

export const NhomLoaiCapPhep = [
    {
        id: NhomLoaiCapPhepEnum.ThamDoKhoangSan,
        name: "Thăm dò khoáng sản"
    },
    {
        id: NhomLoaiCapPhepEnum.PheDuyetTruLuong,
        name: "Phê duyệt trữ lượng khoáng sản"
    },
    {
        id: NhomLoaiCapPhepEnum.DauGiaQuyenKhaiThac,
        name: "Đấu giá quyền khai thác khoáng sản"
    },
    {
        id: NhomLoaiCapPhepEnum.KhaiThacKhoangSan,
        name: "Khai thác khoáng sản"
    },
    {
        id: NhomLoaiCapPhepEnum.TanThuKhoangSan,
        name: "Tận thu khoáng sản"
    },
    {
        id: NhomLoaiCapPhepEnum.TraLaiGiayPhep,
        name: "Trả lại giấy phép thăm do, khai thác"
    },
    {
        id: NhomLoaiCapPhepEnum.DongCuaMo,
        name: "Đóng cửa mỏ, khoáng sản"
    },
    {
        id: NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac,
        name: "Chuyển nhượng thăm dò khai thác"
    }
];
