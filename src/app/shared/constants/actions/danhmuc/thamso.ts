import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addThamSoAction: boolean = checkUserHasPermision({
  url: "api/thamso",
  httpMethod: "post",
  hasPermission: false,
});

export const _editThamSoAction: boolean = checkUserHasPermision({
  url: "api/thamso",
  httpMethod: "put",
  hasPermission: false,
});

export const _deleteThamSoAction: boolean = checkUserHasPermision({
  url: "api/thamso",
  httpMethod: "delete",
  hasPermission: false,
});

export const _detailThamSoAction: boolean = checkUserHasPermision({
  url: "api/thamso/id",
  httpMethod: "get",
  hasPermission: false,
});

export const _listThamSoAction: boolean = checkUserHasPermision({
  url: "api/thamso",
  httpMethod: "get",
  hasPermission: false,
});

export const _getThamSoByIdNhomThamSo: boolean = checkUserHasPermision({
  url: "api/thamso/idnhomthamso",
  httpMethod: "get",
  hasPermission: false,
});

export const _checkHasTags: boolean = checkUserHasPermision({
  url: "api/thamso/check-has-tags",
  httpMethod: "get",
  hasPermission: false,
});
