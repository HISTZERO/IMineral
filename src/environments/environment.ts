// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Cấu hình xác thực đăng nhập
let authConfig = {
  authenClientId: "vilis-client",
  authenResponseType: "id_token token",
  authenClientSecret: "y47XC$2Xz3h^7R",
  authenApiUrl: "http://10.159.21.211:5006/",
  authenRedirectUri: `${location.origin}/login-redirect.html`,
  authenLogOutRedirectUri: `${location.origin}?postLogout=true`,
  authenScope: "openid authorize-vilis-api profile offline_access",
  authenSilentRedirectUri: `${location.origin}/silent-renew.html`,
};

// Api
let ipIMinerals = "http://10.159.21.211";
let iMineralLocal = "http://10.1.90.200";

export const environment = {
  ...authConfig,
  production: false,
  appName: "iMineral",
  apiIMineral: `${ipIMinerals}:8086/api/`,  
  apiIMineralLocal: `${iMineralLocal}:8086/api/`,  
  apiLogRequestURL: "http://10.159.21.211:5500/",
  apiUserRoleURL: "http://10.159.21.211:5500/api/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
