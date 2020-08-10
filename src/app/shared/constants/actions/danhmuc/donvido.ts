import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addDonViDoAction: boolean = checkUserHasPermision({
  url: "api/donvido",
  httpMethod: "post",
});

export const _editDonViDoAction: boolean = checkUserHasPermision({
  url: "api/donvido",
  httpMethod: "put",
});

export const _deleteDonViDoAction: boolean = checkUserHasPermision({
  url: "api/donvido",
  httpMethod: "delete",
});

export const _detailDonViDoAction: boolean = checkUserHasPermision({
  url: "api/donvido/id",
  httpMethod: "get",
});

export const _listDonViDoAction: boolean = checkUserHasPermision({
  url: "api/donvido",
  httpMethod: "get",
});
