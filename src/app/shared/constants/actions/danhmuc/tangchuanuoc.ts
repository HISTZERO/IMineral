import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addTangChuaNuocAction: boolean = checkUserHasPermision({
  url: "api/tangchuanuoc",
  httpMethod: "post",
});

export const _editTangChuaNuocAction: boolean = checkUserHasPermision({
  url: "api/tangchuanuoc",
  httpMethod: "put",
});

export const _deleteTangChuaNuocAction: boolean = checkUserHasPermision({
  url: "api/tangchuanuoc",
  httpMethod: "delete",
});

export const _detailTangChuaNuocAction: boolean = checkUserHasPermision({
  url: "api/tangchuanuoc/id",
  httpMethod: "get",
});

export const _listTangChuaNuocAction: boolean = checkUserHasPermision({
  url: "api/tangchuanuoc",
  httpMethod: "get",
});
