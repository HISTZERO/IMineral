import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addThietBiQuanTracAction: boolean = checkUserHasPermision({
  url: "api/thietbiquantrac",
  httpMethod: "post",
});

export const _editThietBiQuanTracAction: boolean = checkUserHasPermision({
  url: "api/thietbiquantrac",
  httpMethod: "put",
});

export const _deleteThietBiQuanTracAction: boolean = checkUserHasPermision({
  url: "api/thietbiquantrac",
  httpMethod: "delete",
});

export const _detailThietBiQuanTracAction: boolean = checkUserHasPermision({
  url: "api/thietbiquantrac/id",
  httpMethod: "get",
});

export const _listThietBiQuanTracAction: boolean = checkUserHasPermision({
  url: "api/thietbiquantrac",
  httpMethod: "get",
});
