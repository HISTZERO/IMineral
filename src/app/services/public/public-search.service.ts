import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class PublicSearchService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: null,
      outputModelName: null,
      apiUrl: environment.apiIMineral + ServiceName.SEARCH
    });
  }
  // get search data
  // public getSearchData(state, param) {
  //   this.setServiceInfo({
  //     apiUrl: environment.apiSearchURL + ServiceName.SEARCH
  //   });
  //   return this.getData(state, param);
  // }
  public getFetchSearchData(state, param) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.SEARCH
    });
    return this.getFetchAll(param);
  }
  // get search data
  public getSearchData(state, param) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.SEARCH
    });
    return this.getDataFromServer(state, param);
  }
}
