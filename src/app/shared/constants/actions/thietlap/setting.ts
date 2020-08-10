import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addSettingAction: boolean = checkUserHasPermision({
  url: "api/setting",
  httpMethod: "post",
});

export const _editSettingAction: boolean = checkUserHasPermision({
  url: "api/setting",
  httpMethod: "put",
});

export const _deleteSettingAction: boolean = checkUserHasPermision({
  url: "api/setting",
  httpMethod: "delete",
});

export const _getSettingByKeyAction: boolean = checkUserHasPermision({
  url: "api/setting/key",
  httpMethod: "get",
});

export const _listSettingAction: boolean = checkUserHasPermision({
  url: "api/setting",
  httpMethod: "get",
});
