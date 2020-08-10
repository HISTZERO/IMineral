import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addLayerGroupsAction: boolean = checkUserHasPermision({
  url: "api/layergroups",
  httpMethod: "post",
});

export const _editLayerGroupsAction: boolean = checkUserHasPermision({
  url: "api/layergroups",
  httpMethod: "put",
});

export const _deleteLayerGroupsAction: boolean = checkUserHasPermision({
  url: "api/layergroups",
  httpMethod: "delete",
});

export const _detailLayerGroupsAction: boolean = checkUserHasPermision({
  url: "api/layergroups/id",
  httpMethod: "get",
});

export const _listLayerGroupsAction: boolean = checkUserHasPermision({
  url: "api/layergroups",
  httpMethod: "get",
});

export const _getGroupIdGroupNameAction: boolean = checkUserHasPermision({
  url: "api/layergroups/get-groupId-groupName",
  httpMethod: "get",
});

export const _listLayerGroupsGetTreeLayerGroupAction: boolean = checkUserHasPermision(
  {
    url: "api/layergroups/get-tree-layerGroupr",
    httpMethod: "get",
  }
);
