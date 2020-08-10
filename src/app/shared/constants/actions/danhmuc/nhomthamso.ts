import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addNhomThamSoAction: boolean = checkUserHasPermision({
  url: "api/nhomthamso",
  httpMethod: "post",
});

export const _editNhomThamSoAction: boolean = checkUserHasPermision({
  url: "api/nhomthamso",
  httpMethod: "put",
});

export const _deleteNhomThamSoAction: boolean = checkUserHasPermision({
  url: "api/nhomthamso",
  httpMethod: "delete",
});

export const _detailNhomThamSoAction: boolean = checkUserHasPermision({
  url: "api/nhomthamso/id",
  httpMethod: "get",
});

export const _listNhomThamSoAction: boolean = checkUserHasPermision({
  url: "api/nhomthamso",
  httpMethod: "get",
});
