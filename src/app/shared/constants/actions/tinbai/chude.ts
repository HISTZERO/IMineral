import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addChuDeAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "post",
});

export const _editChuDeAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "put",
});

export const _deleteChuDeAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "delete",
});

export const _detailChuDeAction: boolean = checkUserHasPermision({
  url: "api/categories/id",
  httpMethod: "get",
});

export const _listChuDeAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "get",
});
