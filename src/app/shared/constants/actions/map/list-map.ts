import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _canAddMapListAction: boolean = checkUserHasPermision({
  url: "api/map",
  httpMethod: "post",
});

export const _canEditMapListAction: boolean = checkUserHasPermision({
  url: "api/map",
  httpMethod: "put",
});

export const _canDeleteMapListAction: boolean = checkUserHasPermision({
  url: "api/map",
  httpMethod: "delete",
});

export const _canDetailMapListAction: boolean = checkUserHasPermision({
  url: "api/map/id",
  httpMethod: "get",
});

export const _canListMapListAction: boolean = checkUserHasPermision({
  url: "api/map",
  httpMethod: "get",
});

export const _canMapTreeLayerAction: boolean = checkUserHasPermision({
  url: "api/map/tree-layer",
  httpMethod: "put",
});
