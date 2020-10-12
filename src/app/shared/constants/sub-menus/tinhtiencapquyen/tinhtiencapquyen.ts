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
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinhtiencapquyenUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];



