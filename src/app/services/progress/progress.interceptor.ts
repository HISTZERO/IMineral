import { v4 as uuidv4 } from "uuid";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, finalize } from "rxjs/operators";

import { ProgressService } from "./progress.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { CoreRoutingName } from "src/app/routes/core-routes-name";

@Injectable()
export class ProgressHttpInterceptor implements HttpInterceptor {

  public listRequest: any[] = [];

  constructor(
    public router: Router,
    private progressService: ProgressService,
    @Inject(PLATFORM_ID) private platformId,
    public authService: AuthService
  ) { }

  getLastRequests(requestNumber: number) {
    return this.listRequest.slice(Math.max(this.listRequest.length - requestNumber, 0));
  }

  cloneHeader(req: HttpRequest<any>) {

    // Clone the request to add the new header.
    let headers = req.headers;
    if (isPlatformBrowser(this.platformId)) {
      headers = req.headers.set(
        "Authorization",
        "Bearer " + this.authService.getAccessToken()
      );
    }

    return headers;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Khởi tạo request
    let request = {
      uuid: uuidv4(),
      finalize: false,
      requestTime: Date.now(),
    };

    // Set authorization header
    let headers = this.cloneHeader(req)

    // Push request vào mảng request
    this.listRequest.push(request);

    // Hiển thị progress bar
    this.progressService.show();

    // Ẩn nội dung
    this.authService.hideContent();

    return next.handle(req.clone({ headers })).pipe(
      tap(
        (event: HttpEvent<any>) => { },
        (error) => {
          // Hết hạn hoặc chưa đăng nhập
          if (error.status === 401) {
            this.router.navigate([
              `/${window.location.href.split("/")[3]}/${
              CoreRoutingName.ErrorUri
              }/${CoreRoutingName.NotAuthenticatedUri}`,
            ]);
          }

          // Không có quyền
          if (error.status === 403) {
            this.router.navigate([
              `/${window.location.href.split("/")[3]}/${
              CoreRoutingName.ErrorUri
              }/${CoreRoutingName.NotAuthorizedUri}`,
            ]);
          }
        }
      ),
      finalize(() => {
        // Tìm request trong list request để gán lại trạng thái finalize
        this.listRequest.map((_request) => {
          _request.finalize =
            _request.uuid === request.uuid ? true : _request.finalize;
        });

        // Lấy 20 request cuối cùng
        let lastRequests = this.getLastRequests(20);

        // Ẩn progress bar
        this.progressService.hide(lastRequests);

        // Hiển thị nội dung
        this.authService.showContent(lastRequests);
      })
    );
  }
}
