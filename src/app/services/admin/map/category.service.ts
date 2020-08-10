import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputCategoryModel,
  OutputCategoryModel
} from "src/app/models/admin/map/category.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class CategoryService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputCategoryModel(),
      outputModelName: new OutputCategoryModel(),
      apiUrl: environment.apiMapURL + ServiceName.MCATEGORY
    });
  }

  // Get all categories
  public getTreeCategories() {
    this.setServiceInfo({
      apiUrl: `${environment.apiMapURL + ServiceName.MCATEGORY}/get-tree-categories`
    });
    return this.getFetchAll();
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
