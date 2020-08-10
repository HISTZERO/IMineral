import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addMapLayerItemIdsAction: boolean = checkUserHasPermision({
  url: "api/maplayer/itemIds",
  httpMethod: "post",
});

export const _addMapLayerLayerGroupIdsAction: boolean = checkUserHasPermision({
  url: "api/maplayer/layerGroupIds",
  httpMethod: "post",
});

export const _addMapLayerLayerIdsAction: boolean = checkUserHasPermision({
  url: "api/maplayer/layerIds",
  httpMethod: "post",
});

export const _editMapLayerAction: boolean = checkUserHasPermision({
  url: "api/maplayer",
  httpMethod: "put",
});

export const _deleteMapLayerAction: boolean = checkUserHasPermision({
  url: "api/maplayer",
  httpMethod: "delete",
});

export const _detailMapLayerAction: boolean = checkUserHasPermision({
  url: "api/maplayer/id",
  httpMethod: "get",
});

export const _listMapLayerAction: boolean = checkUserHasPermision({
  url: "api/maplayer",
  httpMethod: "get",
});

export const _listMapLayerByMapIdAction: boolean = checkUserHasPermision({
  url: "api/maplayer/get-by-mapId/mapId",
  httpMethod: "get",
});

export const _listAllMapLayerByMapIdAction: boolean = checkUserHasPermision({
  url: "api/maplayer/get-all-mapLayer-layer-by-mapId/mapId",
  httpMethod: "get",
});

export const _listMapLayerByMapIdLayerGroupIdAction: boolean = checkUserHasPermision(
  {
    url: "api/maplayer/get-map-layer-by-mapId-layerGroupId",
    httpMethod: "get",
  }
);
