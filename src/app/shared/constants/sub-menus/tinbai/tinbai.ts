import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuTinBaiChuDe = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Tin bài",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinbaiUri}`,
  },
  {
    title: "Chủ đề",
    url: "",
  },
];

export const MenuTinBaiTinTuc = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Tin bài",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinbaiUri}`,
  },
  {
    title: "Tin tức",
    url: "",
  },
];

export const MenuTinBaiTinTucReview = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Tin bài",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinbaiUri}`,
  },
  {
    title: "Tin tức",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.tinbaiUri}/${AdminRoutingName.tinTuc}`,
  },
  {
    title: "Xem trước",
    url: "",
  },
];
