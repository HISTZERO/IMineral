import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _editMapLayerGroupAction: boolean = checkUserHasPermision({
  url: "api/maplayergroup/mapLayerGroupName",
  httpMethod: "put",
});

export const _deleteMapLayerGroupAction: boolean = checkUserHasPermision({
  url: "api/maplayergroup",
  httpMethod: "delete",
});

export const _mapLayerGroupByMapIdAction: boolean = checkUserHasPermision({
  url: "api/maplayergroup/mapId",
  httpMethod: "get",
});
