import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { NhomLoaiCapPhepEnum } from "./enum";
import { NhomLoaiCapPhep } from "./nhomloaicapphep-constants";

export const LoaiDoiTuong = [
    {
        id: 1,
        name: "Cá nhân"
    },
    {
        id: 2,
        name: "Tổ chức"
    }
];

export const LoaiGiayTo = [
    {
        id: 1,
        name: "Chứng minh nhân dân"
    },
    {
        id: 2,
        name: "Căn cước công dân"
    },
    {
        id: 3,
        name: "Hộ chiếu"
    },
    {
        id: 4,
        name: "Quyết định thành lập"
    },
    {
        id: 5,
        name: "Đăng ký kinh doanh"
    },
    {
        id: 6,
        name: "Chứng nhận đầu tư"
    }
];

export const HinhThucNopHoSo = [
    {
        id: 1,
        name: "Trực tuyến"
    },
    {
        id: 2,
        name: "Trực tiếp"
    },
    {
        id: 3,
        name: "Bưu điện"
    }
];

export const HinhThucNhanKetQua = [
    {
        id: 1,
        name: "Trực tuyến"
    },
    {
        id: 2,
        name: "Trực tiếp"
    },
    {
        id: 3,
        name: "Bưu điện"
    }
];

export const TrangThaiHoSo = [
    {
        id: 1,
        name: "Chờ tiếp nhận"
    },
    {
        id: 2,
        name: "Đã tiếp nhận"
    },
    {
        id: 3,
        name: "Đang xử lý"
    },
    {
        id: 4,
        name: "Đã xử lý"
    },
    {
        id: 5,
        name: "Trả kết quả"
    }
];

export const LoaiKhuVucThamDo = [
    {
        id: 1,
        name: "Khu vực thăm dò"
    },
    {
        id: 2,
        name: "Khu vực trả lại"
    }
];

export const LoaiKhuVucKhaiThac = [
    {
        id: 1,
        name: "Khu vực khai thác"
    },
    {
        id: 2,
        name: "Khu vực trả lại"
    }
];

export const LoaiVanBan = [
    {
        id: 1,
        name: "Giấy phép"
    },
    {
        id: 2,
        name: "Quyết định"
    },
    {
        id: 3,
        name: "Bản xác nhận"
    },
    {
        id: 4,
        name: "Văn bản từ chối"
    }
];

export const DonViDienTich = [
  {
      id: 'km',
      name: "km"
  },
  {
      id: 'm',
      name: "m"
  }
];

export const DonViThoiHan = [
  {
      id: "tháng",
      name: "tháng"
  },
  {
      id: "năm",
      name: "năm"
  }
];

export const DonViDoSau = [
  {
      id: "m",
      name: "m"
  }
];

export const DangKhoangSan = [
    {
        id: 1,
        name: "Khoáng sản rắn"
    },
    {
        id: 2,
        name: "Khoáng sản nước nóng"
    }
];

export const NhomCapTaiNguyen = [
    {
        id: 1,
        name: "Cấp tài nguyên khoáng sản rắn xác định"
    },
    {
        id: 2,
        name: "Cấp tài nguyên khoáng sản rắn dự báo"
    }
];



export const MaLoaiHinh = [
    {
        id: 1,
        name: "Khu vực cấm"
    },
    {
        id: 2,
        name: "Khu vực tạm cấm"
    }
];

export const DoiTuongBaoCao = [
    {
        id: 1,
        name: "Cơ quan nhà nước"
    },
    {
        id: 2,
        name: "Cá nhân, tổ chức"
    }
];

export const RoutingNameChiTietDangKyHoatDongKS: any = {
    [NhomLoaiCapPhepEnum.ThamDoKhoangSan]: "dkthamdokhoangsanchitiet",
    [NhomLoaiCapPhepEnum.KhaiThacKhoangSan]: "dkkhaithackhoangsanchitiet",
    [NhomLoaiCapPhepEnum.PheDuyetTruLuong]: "dkpheduyettruluongkhoangsanchitiet",
    [NhomLoaiCapPhepEnum.DauGiaQuyenKhaiThac]: "dkdaugiaquyenchitiet",
    [NhomLoaiCapPhepEnum.TanThuKhoangSan]: "dktanthukhoangsanchitiet",
    [NhomLoaiCapPhepEnum.TraLaiGiayPhep]: "dktralaigiayphepchitiet",
    [NhomLoaiCapPhepEnum.DongCuaMo]: "dkdongcuamochitiet",
    [NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac]: "dkchuyennhuongquyenchitiet",
  };


