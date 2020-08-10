import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addCoQuanToChucAction: boolean = checkUserHasPermision({
  url: "api/coquantochuc",
  httpMethod: "post",
});

export const _editCoQuanToChucAction: boolean = checkUserHasPermision({
  url: "api/coquantochuc",
  httpMethod: "put",
});

export const _deleteCoQuanToChucAction: boolean = checkUserHasPermision({
  url: "api/coquantochuc",
  httpMethod: "delete",
});

export const _detailCoQuanToChucAction: boolean = checkUserHasPermision({
  url: "api/coquantochuc/id",
  httpMethod: "get",
});

export const _listCoQuanToChucAction: boolean = checkUserHasPermision({
  url: "api/coquantochuc",
  httpMethod: "get",
});
