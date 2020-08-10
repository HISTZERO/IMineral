import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addTinTucAction: boolean = checkUserHasPermision({
  url: "api/articles",
  httpMethod: "post",
});

export const _editTinTucAction: boolean = checkUserHasPermision({
  url: "api/articles",
  httpMethod: "put",
});

export const _deleteTinTucAction: boolean = checkUserHasPermision({
  url: "api/articles",
  httpMethod: "delete",
});

export const _detailTinTucAction: boolean = checkUserHasPermision({
  url: "api/articles/id",
  httpMethod: "get",
});

export const _listTinTucAction: boolean = checkUserHasPermision({
  url: "api/articles",
  httpMethod: "get",
});
