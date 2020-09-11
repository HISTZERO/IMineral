import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuCauHinhTaiLieu = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Thiết lập",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}`,
  },
  {
    title: "Cấu hình tài liệu",
    url: "",
  },
];
