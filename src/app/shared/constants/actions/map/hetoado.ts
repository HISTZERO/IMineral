import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _canAddHeToaDoAction: boolean = checkUserHasPermision({
  url: "api/projection",
  httpMethod: "post",
});

export const _canEditHeToaDoAction: boolean = checkUserHasPermision({
  url: "api/projection",
  httpMethod: "put",
});

export const _canDeleteHeToaDoAction: boolean = checkUserHasPermision({
  url: "api/projection",
  httpMethod: "delete",
});

export const _canDetailHeToaDoAction: boolean = checkUserHasPermision({
  url: "api/projection/id",
  httpMethod: "get",
});

export const _canListHeToaDoAction: boolean = checkUserHasPermision({
  url: "api/projection",
  httpMethod: "get",
});
