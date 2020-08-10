import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addGroupLayerAction: boolean = checkUserHasPermision({
  url: "api/grouplayer",
  httpMethod: "post",
});

export const _editGroupLayerAction: boolean = checkUserHasPermision({
  url: "api/grouplayer",
  httpMethod: "put",
});

export const _deleteGroupLayerAction: boolean = checkUserHasPermision({
  url: "api/grouplayer",
  httpMethod: "delete",
});

export const _editGroupLayerGroupOrderAction: boolean = checkUserHasPermision({
  url: "api/grouplayer/groupOrder",
  httpMethod: "put",
});

export const _listGroupLayerByLayerGroupIdAction: boolean = checkUserHasPermision(
  {
    url: "api/grouplayer",
    httpMethod: "get",
  }
);

export const _getLayerIdLayerNameAction: boolean = checkUserHasPermision({
  url: "api/grouplayer/get-layerId-layerName/layerGroupId",
  httpMethod: "get",
});

export const _listGroupLayerByLayerGroupIdLayerIdAction: boolean = checkUserHasPermision(
  {
    url: "api/grouplayer/get-by-layerGroupId-layerId/layerGroupId/layerId",
    httpMethod: "get",
  }
);

export const _listGroupLayerGetTreeLayerAction: boolean = checkUserHasPermision(
  {
    url: "api/grouplayer/get-tree-layer",
    httpMethod: "get",
  }
);
