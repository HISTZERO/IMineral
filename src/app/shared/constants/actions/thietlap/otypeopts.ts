import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addOtypeOptsAction: boolean = checkUserHasPermision({
  url: "api/otypeOpts",
  httpMethod: "post",
});

export const _editOtypeOptsAction: boolean = checkUserHasPermision({
  url: "api/otypeOpts",
  httpMethod: "put",
});

export const _deleteOtypeOptsAction: boolean = checkUserHasPermision({
  url: "api/otypeOpts",
  httpMethod: "delete",
});

export const _detailOtypeOptsAction: boolean = checkUserHasPermision({
  url: "api/otypeOpts/id",
  httpMethod: "get",
});

export const _getAllByOtypeKeyAction: boolean = checkUserHasPermision({
  url: "api/otypeOpts/get-all-by-otypeKey/otypeKey/listInIO",
  httpMethod: "get",
});
