import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addObjKeyAction: boolean = checkUserHasPermision({
    url: "api/objkey",
    httpMethod: "post"
});

export const _editObjKeyAction: boolean = checkUserHasPermision({
    url: "api/objkey",
    httpMethod: "put"
});

export const _deleteObjKeyAction: boolean = checkUserHasPermision({
    url: "api/objkey",
    httpMethod: "delete"
});

export const _detailObjKeyAction: boolean = checkUserHasPermision({
    url: "api/objkey/id",
    httpMethod: "get"
});

export const _listObjKeyAction: boolean = checkUserHasPermision({
    url: "api/objkey",
    httpMethod: "get"
});

export const _listDataByObjKeyIdAction: boolean = checkUserHasPermision({
    url: "api/objkey/get-data-by-id-objKey/objKey/id",
    httpMethod: "get"
});
