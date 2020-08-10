import { USER_ACTION } from "src/app/shared/constants/auth-constants";

export function checkUserHasPermision(role: any) {

    // Lấy danh sách actions của user trong local storage
    let storageActions = JSON.parse(localStorage.getItem(USER_ACTION));
    let userActions = storageActions !== null ? storageActions.data : [];

    // Tìm kiểm role trong danh sách action của user
    let findResults = userActions.filter(userAction => {
        return role.httpMethod === userAction.httpMethod && role.url.toLowerCase() === userAction.url.toLowerCase();
    });

    // Trả về true nếu tìm thấy role trong ds actions và ngược lại
    return findResults.length ? true : false;
}