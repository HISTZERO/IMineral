import { NgModule, OnInit, APP_INITIALIZER } from "@angular/core";
import {
  BrowserModule,
  BrowserTransferStateModule,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import {
  IModuleTranslationOptions,
  ModuleTranslateLoader,
} from "@larscom/ngx-translate-module-loader";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { AppComponent } from "src/app/app.component";
import { MapModule } from "src/app/features/map/map.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AdminModule } from "src/app/features/admin/admin.module";
import { PublicModule } from "src/app/features/public/public.module";
import { AuthService } from "src/app/services/auth/auth.service";
import { ErrorModule } from "src/app/shared/modules/error/error.module";
import { SearchModule } from "src/app/shared/modules/search/search.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    BrowserTransferStateModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AdminModule,
    MapModule,
    SharedModule,
    PublicModule,
    ErrorModule,
    SearchModule,
    MatProgressBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: moduleHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  ngOnInit() { }
}

export function init_app(authService: AuthService): Function {
  return () => authService.setupUserManager();
}

export function moduleHttpLoaderFactory(http: HttpClient) {
  const baseTranslateUrl = "./assets/i18n";

  const options: IModuleTranslationOptions = {
    translateError: (error, path) => {
      console.log("Oeps! an error occurred: ", { error, path });
    },
    modules: [
      { moduleName: "danhmuc", baseTranslateUrl },
      { moduleName: "khuvuckhoangsan", baseTranslateUrl },
      { moduleName: "diemquangmoquang", baseTranslateUrl },
      { moduleName: "dangkyhoatdongkhoangsan", baseTranslateUrl },
      { moduleName: "capphephoatdongkhoangsan", baseTranslateUrl },
      { moduleName: "hosogiayto", baseTranslateUrl },
      { moduleName: "common", baseTranslateUrl },
      { moduleName: "baocao", baseTranslateUrl },
      { moduleName: "thietlap", baseTranslateUrl },
      { moduleName: "share", baseTranslateUrl },
      { moduleName: "map", baseTranslateUrl },
      { moduleName: "public", baseTranslateUrl },
      { moduleName: "tinbai", baseTranslateUrl },
    ],
  };
  return new ModuleTranslateLoader(http, options);
}
