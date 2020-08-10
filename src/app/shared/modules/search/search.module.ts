import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';

import { SearchBoxComponent } from "./search-box/search-box.component";
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchResultDataComponent } from "./search-result/search-result-data/search-result-data.component";
import { SearchResultFillterComponent } from "./search-result/search-result-fillter/search-result-fillter.component";
import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";

// Import AdminShare để sử dụng các components dùng chung cho toàn bộ admin
// Import AdminQuantracShared để sử dụng các components riêng cho phần quan trắc
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { FeaturesSharedModule } from "src/app/features/features-shared.module";


@NgModule({
  declarations: [
    SearchComponent,
    SearchBoxComponent,
    SearchResultComponent,
    SearchResultFillterComponent,
    SearchResultDataComponent,
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    AdminSharedModule,
    FeaturesSharedModule
  ],
  providers: [
    SearchResultDataComponent
  ],
  exports: [
    SearchBoxComponent,
    SearchResultComponent,
    SearchResultFillterComponent,
    SearchResultDataComponent
  ]
})
export class SearchModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
