import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addObjOptsValueAction: boolean = checkUserHasPermision({
  url: "api/optsValue",
  httpMethod: "post",
});

export const _editObjOptsValueAction: boolean = checkUserHasPermision({
  url: "api/optsValue",
  httpMethod: "put",
});

export const _deleteObjOptsValueAction: boolean = checkUserHasPermision({
  url: "api/optsValue",
  httpMethod: "delete",
});

export const _getObjOptsValueByObjIdAction: boolean = checkUserHasPermision({
  url: "api/optsValue/objId",
  httpMethod: "get",
});

export const _getObjOptsValueByOtypeKeyAction: boolean = checkUserHasPermision({
  url: "api/optsValue/otypeKey",
  httpMethod: "get",
});

export const _getObjOptsValueByObjIdAndListOrIoAction: boolean = checkUserHasPermision(
  {
    url: "api/optsValue/objId/listInIO",
    httpMethod: "get",
  }
);
export const _getobjOptsValueToaDoAction: boolean = checkUserHasPermision({
  url: "api/optsValue/toadox/toadoy/srid/kieutoado",
  httpMethod: "get",
});
