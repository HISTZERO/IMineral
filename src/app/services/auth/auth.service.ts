import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  User,
  UserManager,
  WebStorageStateStore,
  UserManagerSettings,
} from "oidc-client";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})

export class AuthService extends RepositoryEloquentService {

  // Unit user/user manager
  public user: User;
  public browserHistoryUrl: string;
  private userManager: UserManager;

  // Ẩn hiện giao diện
  public isHidden: BehaviorSubject<boolean>;

  // User roles
  public userActions: any = [];
  public storageKey: string = 'USER_ACTION';

  constructor(public httpClient: HttpClient) {
    super();

    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: null,
      outputModelName: null,
      apiUrl: environment.apiUserRoleURL + ServiceName.USERROLE
    });

    this.isHidden = new BehaviorSubject(true);
  }

  /**
   * Hàm kiểm tra quyền của user
   * @param roles Danh sách các quyền
   */
  checkUserHasPermision(roles: any[]) {
    roles.map(role => {
      let findResults = this.userActions.filter(userAction => {
        return role.httpMethod === userAction.httpMethod && role.url === userAction.url;
      });
      role.hasPermission = findResults.length ? true : false;
    })
  }

  /**
   * Lấy danh sách quyền của user
   */
  async getUserRoles() {

    // Xóa dữ liệu quyền trong local storage
    localStorage.removeItem(this.storageKey);

    // Gọi api lấy danh sách actions của user
    let response: any = await this.getFetchAll();
    if (response.isError === false) {

      // Gán danh sách quyền
      this.userActions = response.data;

      // Lưu danh sách actions của user vào local storage
      localStorage.setItem(this.storageKey, JSON.stringify({
        data: response.data,
      }));
    }
  }

  /**
   * Khi url trên trình duyệt thay đổi
   * => ẩn nội dung
   */
  hideContent() {
    if (this.browserHistoryUrl !== window.location.href && !this.isHidden.value) {
      this.isHidden.next(true);
    }
    this.browserHistoryUrl = window.location.href;
  }

  /**
   * Hiển thị nội dung nếu tất cả các request đã hoàn thành
   * @param listRequest Danh sách request
   */
  showContent(listRequest: any[]) {

    // Tìm các request đã hoàn thành (finalize === true)
    let finalizeRequest = listRequest.filter((request) => {
      return request.finalize === true;
    });

    // Kiểm tra xem các request đã hoàn thành ?
    // Nếu các request đã hoàn thành thì xóa class hidden đi
    if (finalizeRequest.length === listRequest.length) {
      this.isHidden.next(false);
    }
  }

  login(): Promise<any> {
    return this.userManager.signinRedirect({ state: window.location.href });
  }

  register() {
    location.href = `${this.userManager.settings.authority}/account/register?returnUrl=${location.href}`;
  }

  profile() {
    window.open(`${this.userManager.settings.authority}manage/index`, "_blank");
  }

  logout(): any {
    return this.userManager.signoutRedirect();
  }

  isLoggedIn(): boolean {
    return this.user && this.user.access_token && !this.user.expired;
  }

  getAccessToken(): string {
    return this.user ? this.user.access_token : "";
  }

  signoutRedirectCallback(): Promise<any> {
    return this.userManager.signoutRedirectCallback();
  }

  getUser() {
    return this.user ? this.user.profile : { given_name: '', name: '' };
  }

  setupUserManager() {
    const config: UserManagerSettings = {
      automaticSilentRenew: true,
      scope: environment.authenScope,
      authority: environment.authenApiUrl,
      client_id: environment.authenClientId,
      redirect_uri: environment.authenRedirectUri,
      response_type: environment.authenResponseType,
      client_secret: environment.authenClientSecret,
      post_logout_redirect_uri: environment.authenLogOutRedirectUri,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      // silent_redirect_uri: environment.authenSilentRedirectUri,
    };

    this.userManager = new UserManager(config);
    this.userManager.getUser().then((user) => {
      if (user && !user.expired) {
        this.user = user;
        // this.loadSecurityContext();
      }
    });

    this.userManager.events.addUserLoaded((args) => {
      this.userManager.getUser().then((user) => {
        this.user = user;
        // this.loadSecurityContext();
      });
    });
  }
}
