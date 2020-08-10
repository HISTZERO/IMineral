import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addCongTyAction: boolean = checkUserHasPermision({
  url: "api/congty",
  httpMethod: "post",
});

export const _editCongTyAction: boolean = checkUserHasPermision({
  url: "api/congty",
  httpMethod: "put",
});

export const _deleteCongTyAction: boolean = checkUserHasPermision({
  url: "api/congty",
  httpMethod: "delete",
});

export const _detailCongTyAction: boolean = checkUserHasPermision({
  url: "api/congty/id",
  httpMethod: "get",
});

export const _listCongTyAction: boolean = checkUserHasPermision({
  url: "api/congty",
  httpMethod: "get",
});
