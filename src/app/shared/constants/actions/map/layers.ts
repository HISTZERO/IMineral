import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _canAddLayersAction: boolean = checkUserHasPermision({
  url: "api/layers",
  httpMethod: "post",
});

export const _canEditLayersAction: boolean = checkUserHasPermision({
  url: "api/layers",
  httpMethod: "put",
});

export const _canDeleteLayersAction: boolean = checkUserHasPermision({
  url: "api/layers",
  httpMethod: "delete",
});

export const _canDetailLayersAction: boolean = checkUserHasPermision({
  url: "api/layers/id",
  httpMethod: "get",
});

export const _canListLayersAction: boolean = checkUserHasPermision({
  url: "api/layers",
  httpMethod: "get",
});

export const _listLayersGetAllIdNameAction: boolean = checkUserHasPermision({
  url: "api/layers/get-all-id-name",
  httpMethod: "get",
});
