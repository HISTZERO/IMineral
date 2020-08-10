import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addTcclAction: boolean = checkUserHasPermision({
  url: "api/tccl",
  httpMethod: "post",
});

export const _editTcclAction: boolean = checkUserHasPermision({
  url: "api/tccl",
  httpMethod: "put",
});

export const _deleteTcclAction: boolean = checkUserHasPermision({
  url: "api/tccl",
  httpMethod: "delete",
});

export const _detailTcclAction: boolean = checkUserHasPermision({
  url: "api/tccl/id",
  httpMethod: "get",
});

export const _listTcclAction: boolean = checkUserHasPermision({
  url: "api/tccl",
  httpMethod: "get",
});
