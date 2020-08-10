import { checkUserHasPermision } from "src/app/shared/constants/actions/action";

export const _addLoaiSoLieuAction: boolean = checkUserHasPermision({
  url: "api/loaisolieu",
  httpMethod: "post",
});

export const _editLoaiSoLieuAction: boolean = checkUserHasPermision({
  url: "api/loaisolieu",
  httpMethod: "put",
});

export const _deleteLoaiSoLieuAction: boolean = checkUserHasPermision({
  url: "api/loaisolieu",
  httpMethod: "delete",
});

export const _detailLoaiSoLieuAction: boolean = checkUserHasPermision({
  url: "api/loaisolieu/id",
  httpMethod: "get",
});

export const _listLoaiSoLieuAction: boolean = checkUserHasPermision({
  url: "api/loaisolieu",
  httpMethod: "get",
});
