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
let ipAddress = "http://10.159.21.212";
let ipIMinerals = "http://10.159.21.211";

export const environment = {
  ...authConfig,
  production: false,
  appName: "iWaterGIS",
  apiIMineral: `${ipIMinerals}:8086/api/`,
  apiSwURL: `${ipAddress}:5007/api/`,
  apiWrUrl: `${ipAddress}:5004/api/`,
  apiDataURL: `${ipAddress}:5008/api/`,
  apiCategoryURL: `${ipAddress}:5002/api/`,
  apiCommonURL: `${ipAddress}:5003/api/`,
  apiSearchURL: `${ipAddress}:5003/`,
  apiMapURL: `${ipAddress}:5005/api/`,
  apiLogRequestURL: "http://10.159.21.211:5500/",
  apiUserRoleURL: "http://10.159.21.211:5500/api/"
};

// Config demo 26/5
// let ipAddress = 'http://10.159.21.211';
// export const environment = {
//   production: false,
//   authenApiUrl: 'http://10.193.69.93:5006/',
//   apiWrUrl: `http://ilis-admin-api.vnpt.vn/inres_apiWr/api/`,
//   apiKttvUrl: `http://ilis-admin-api.vnpt.vn/inres_apiKtt/api/`,
//   apiSwUrl: `http://ilis-admin-api.vnpt.vn/inres_apiSw/api/`,
//   apiCategoryURL: `http://ilis-admin-api.vnpt.vn/inres_apiCategory/api/`,
//   apiCommonURL: `http://ilis-admin-api.vnpt.vn/inres_apiCommon/api/`,
//   apiMapURL: `http://ilis-admin-api.vnpt.vn/inres_apiMap/api/`
// };
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
