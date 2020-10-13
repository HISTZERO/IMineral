import { AdminRoutingName } from 'src/app/routes/admin-routes-name';

// Thăm dò khoáng sản
export const MenuTinhTienCapQuyenKhaiThacKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Tính tiền cấp quyền",
    url: "",
  }
];

export const MenuTinhTienCapQuyenChiTietKhaiThacKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Tính tiền cấp quyền",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinhtiencapquyenUri}/${AdminRoutingName.danhsachtinhtiencapquyennUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackTinhTienCapQuyenKhaiThacKhoangSan = [
  {
    title: `Tính tiền cấp quyền`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinhtiencapquyenUri}/${AdminRoutingName.danhsachtinhtiencapquyennUri}`
  },
];



