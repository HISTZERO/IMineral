import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { AuthService } from "src/app/services/auth/auth.service";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { ProgressService } from "src/app/services/progress/progress.service";
import { translateConstants } from "./shared/constants/translate-constants";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "iMonitoring";

  // Lưu biến loading
  public isLoading: boolean = false;

  // Biến trong settingsCommon
  public settingsCommon = new SettingsCommon();
  constructor(
    public router: Router,
    public authService: AuthService,
    public progressService: ProgressService,
    public translate: TranslateService
  ) {
    // Đặt mặc định ngôn ngữ của hệ thống
    translate.addLangs([translateConstants.vi]);
    translate.setDefaultLang(translateConstants.vi);

    // Loading
    this.progressService.visibility.subscribe(async value => {
      this.isLoading = await value;
    })
  }

  async ngOnInit() {
    // Gọi hàm check login
    await this.checkLoginSystem();

    // Gọi hàm lấy danh sách actions của user
    await this.authService.getUserRoles();
  }

  /**
   * Đăng nhập vào hệ thống SSO
   */
  public checkLoginSystem() {
    // Nếu chưa đăng nhập
    // => Redirect qua trang đăng nhập
    if (!this.authService.isLoggedIn()) {
      this.authService.login();
    }

    // Nếu đăng xuất
    if (window.location.href.indexOf("?postLogout=true") > 0) {
      this.authService.signoutRedirectCallback().then(() => {
        const url: string = this.router.url.substring(
          0,
          this.router.url.indexOf("?")
        );
        this.router.navigateByUrl(url);
      });
    }
  }
}
