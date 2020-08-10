import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addTinhAction: boolean = checkUserHasPermision({
  url: "api/tinh",
  httpMethod: "post",
});

export const _editTinhAction: boolean = checkUserHasPermision({
  url: "api/tinh",
  httpMethod: "put",
});

export const _deleteTinhAction: boolean = checkUserHasPermision({
  url: "api/tinh",
  httpMethod: "delete",
});

export const _listTinhAction: boolean = checkUserHasPermision({
  url: "api/tinh",
  httpMethod: "get",
});

export const _addHuyenAction: boolean = checkUserHasPermision({
  url: "api/huyen",
  httpMethod: "post",
});

export const _editHuyenAction: boolean = checkUserHasPermision({
  url: "api/huyen",
  httpMethod: "put",
});

export const _deleteHuyenAction: boolean = checkUserHasPermision({
  url: "api/huyen",
  httpMethod: "delete",
});

export const _listHuyenAction: boolean = checkUserHasPermision({
  url: "api/huyen",
  httpMethod: "get",
});

export const _addXaAction: boolean = checkUserHasPermision({
  url: "api/xa",
  httpMethod: "post",
});

export const _editXaAction: boolean = checkUserHasPermision({
  url: "api/xa",
  httpMethod: "put",
});

export const _deleteXaAction: boolean = checkUserHasPermision({
  url: "api/xa",
  httpMethod: "delete",
});

export const _listXaAction: boolean = checkUserHasPermision({
  url: "api/xa",
  httpMethod: "get",
});

export const _getAllDvhcByCode: boolean = checkUserHasPermision({
  url: "api/get-all-dvhc-by-province-district-ward-code",
  httpMethod: "get",
});
export const _getAllDvhc: boolean = checkUserHasPermision({
  url: "api/get-all-dvhc",
  httpMethod: "get",
});
