import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuDiemMo = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Điểm quặng - mỏ quặng",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.diemquangmoquangUri}`,
  },
  {
    title: "Điểm mỏ",
    url: "",
  },
];
