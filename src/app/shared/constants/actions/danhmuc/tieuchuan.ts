import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addTieuChuanAction: boolean = checkUserHasPermision({
  url: "api/tieuchuan",
  httpMethod: "post",
});

export const _editTieuChuanAction: boolean = checkUserHasPermision({
  url: "api/tieuchuan",
  httpMethod: "put",
});

export const _deleteTieuChuanAction: boolean = checkUserHasPermision({
  url: "api/tieuchuan",
  httpMethod: "delete",
});

export const _detailTieuChuanAction: boolean = checkUserHasPermision({
  url: "api/tieuchuan/id",
  httpMethod: "get",
});

export const _listTieuChuanAction: boolean = checkUserHasPermision({
  url: "api/tieuchuan",
  httpMethod: "get",
});
