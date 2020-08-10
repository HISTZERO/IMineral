import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addObjTypesAction: boolean = checkUserHasPermision({
  url: "api/ObjTypes",
  httpMethod: "post",
});

export const _editObjTypesAction: boolean = checkUserHasPermision({
  url: "api/ObjTypes",
  httpMethod: "put",
});

export const _deleteObjTypesAction: boolean = checkUserHasPermision({
  url: "api/ObjTypes",
  httpMethod: "delete",
});

export const _detailObjTypesAction: boolean = checkUserHasPermision({
  url: "api/ObjTypes/id",
  httpMethod: "get",
});

export const _listObjTypesAction: boolean = checkUserHasPermision({
  url: "api/ObjTypes",
  httpMethod: "get",
});

export const _getListCountOtypeKeyAction: boolean = checkUserHasPermision({
  url: "api/ObjTypes/get-list-count-otypekey/otypeCat",
  httpMethod: "get",
});
