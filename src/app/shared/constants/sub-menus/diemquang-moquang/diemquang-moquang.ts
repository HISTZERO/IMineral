import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuDiemMo = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Diểm quặng - mỏ quặng",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.diemquangmoquangUri}`,
  },
  {
    title: "Diểm mỏ",
    url: "",
  },
];
