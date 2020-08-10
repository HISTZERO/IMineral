import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addHuongGioAction: boolean = checkUserHasPermision({
  url: "api/huonggio",
  httpMethod: "post",
});

export const _editHuongGioAction: boolean = checkUserHasPermision({
  url: "api/huonggio",
  httpMethod: "put",
});

export const _deleteHuongGioAction: boolean = checkUserHasPermision({
  url: "api/huonggio",
  httpMethod: "delete",
});

export const _detailHuongGioAction: boolean = checkUserHasPermision({
  url: "api/huonggio/id",
  httpMethod: "get",
});

export const _listHuongGioAction: boolean = checkUserHasPermision({
  url: "api/huonggio",
  httpMethod: "get",
});
