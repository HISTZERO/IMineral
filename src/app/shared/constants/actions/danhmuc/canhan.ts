import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addCaNhanAction: boolean = checkUserHasPermision({
  url: "api/canhan",
  httpMethod: "post",
});

export const _editCaNhanAction: boolean = checkUserHasPermision({
  url: "api/canhan",
  httpMethod: "put",
});

export const _deleteCaNhanAction: boolean = checkUserHasPermision({
  url: "api/canhan",
  httpMethod: "delete",
});

export const _detailCaNhanAction: boolean = checkUserHasPermision({
  url: "api/canhan/id",
  httpMethod: "get",
});

export const _listCaNhanAction: boolean = checkUserHasPermision({
  url: "api/canhan",
  httpMethod: "get",
});
