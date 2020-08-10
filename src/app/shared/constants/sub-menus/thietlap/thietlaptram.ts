import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuThietLapTram = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Thiết lập",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}`,
  },
  {
    title: "Thiết lập trạm",
    url: "",
  },
];

export const MenuDoiTuongThietLap = [
  { title: "Quản trị", url: "/" + AdminRoutingName.adminUri },
  {
    title: "Thiết lập",
    url: "/" + AdminRoutingName.adminUri + "/" + AdminRoutingName.thietlapUri,
  },
  {
    title: "Thiết lập trạm",
    url:
      "/" +
      AdminRoutingName.adminUri +
      "/" +
      AdminRoutingName.thietlapUri +
      "/" +
      AdminRoutingName.ThietLapTram,
  },
  {
    title: "Thiết lập đối tượng trạm",
    url: "",
  },
];
