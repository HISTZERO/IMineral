import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuKhuVucCamTamCam = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Khu vực khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}`,
  },
  {
    title: "Khu vực cấm & tạm cấm",
    url: "",
  },
];
