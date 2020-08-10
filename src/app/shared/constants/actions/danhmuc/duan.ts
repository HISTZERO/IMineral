import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addDuAnAction: boolean = checkUserHasPermision({
  url: "api/duan",
  httpMethod: "post",
});

export const _editDuAnAction: boolean = checkUserHasPermision({
  url: "api/duan",
  httpMethod: "put",
});

export const _deleteDuAnAction: boolean = checkUserHasPermision({
  url: "api/duan",
  httpMethod: "delete",
});

export const _detailDuAnAction: boolean = checkUserHasPermision({
  url: "api/duan/id",
  httpMethod: "get",
});

export const _listDuAnAction: boolean = checkUserHasPermision({
  url: "api/duan",
  httpMethod: "get",
});
