import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _canAddCategoriesAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "post",
});

export const _canEditCategoriesAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "put",
});

export const _canDeleteCategoriesAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "delete",
});

export const _canDetailCategoriesAction: boolean = checkUserHasPermision({
  url: "api/categories/id",
  httpMethod: "get",
});

export const _canListCategoriesAction: boolean = checkUserHasPermision({
  url: "api/categories",
  httpMethod: "get",
});

export const _canGetTreeCategoriesAction: boolean = checkUserHasPermision({
  url: "api/categories/get-tree-categories",
  httpMethod: "get",
});
