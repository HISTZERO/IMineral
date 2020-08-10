import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  DataStateChangeEventArgs,
  DataResult,
} from "@syncfusion/ej2-angular-grids";
import { map } from "rxjs/operators";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HethonglogService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      apiUrl: `${environment.apiLogRequestURL}/api/v1/Elasticsearch`
    });
  }

  /**
   * Get da phân trang từ elastic search log-request
   * @param state
   * @param body
   */
  public getDataSearchServer(
    state: DataStateChangeEventArgs,
    body
  ): void {
    this.setServiceInfo({
      apiUrl: `${environment.apiLogRequestURL}/api/v1/Elasticsearch/SearchAction`
    });
    this.getDataSearch(state, body).subscribe((x) => {
      super.next(x);
    });
  }
  /**
   * Get data log từ elastic search phân trang observable
   * @param state DataStateChangeEventArgs
   * @param params Search data
   */
  public getDataSearch(state, body): Observable<DataStateChangeEventArgs> {
    body.pageNumber = state.skip / state.take + 1;
    body.pageSize = state.take;
    // Get data
    return this.httpClient
      .post(`${this.apiUrl}`, body, { headers: this.headers })
      .pipe(
        map((response: any) => {
          // Set serial number
          response.data.map((item, index) => {
            item.serialNumber = index + 1 + state.skip;
          });

          // Format data result
          let dataresult = {
            result: response.data,
            count: response.totalRecord,
          } as DataResult;
          return dataresult;
        })
      )
      .pipe((data: any) => {
        return data;
      });
  }

}
