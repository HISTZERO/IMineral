import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addMediaAction: boolean = checkUserHasPermision({
  url: "api/media",
  httpMethod: "post",
});

export const _editMediaAction: boolean = checkUserHasPermision({
  url: "api/media",
  httpMethod: "put",
});

export const _getMediaSearchAction: boolean = checkUserHasPermision({
  url: "api/media/search",
  httpMethod: "get",
});

export const _listMediaAction: boolean = checkUserHasPermision({
  url: "api/media",
  httpMethod: "get",
});

export const _MediaUploadAction: boolean = checkUserHasPermision({
  url: "api/media/upload",
  httpMethod: "post",
});

export const _MediaDeleteAction: boolean = checkUserHasPermision({
  url: "api/media/delete",
  httpMethod: "post",
});
