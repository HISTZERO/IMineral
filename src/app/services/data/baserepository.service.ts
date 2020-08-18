import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, Subject } from "rxjs";
import {
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
import {
  DataStateChangeEventArgs,
  DataResult,
} from "@syncfusion/ej2-angular-grids";
import { environment } from "src/environments/environment";

/**
 * Api url
 * Input model name
 * Output model name
 */
let inputModelName;
let outputModelName;

@Injectable({
  providedIn: "root",
})
export class RepositoryEloquentService extends Subject<DataStateChangeEventArgs> {
  // Các biến dành cho phân trang serve: search và order
  public orderColumn = "";
  public orderValue = "false";
  public Keyword = "";

  public apiUrl: string;
  public httpClient: HttpClient;
  public headers: HttpHeaders = new HttpHeaders({
    "Accept": "multipart/form-data",
    "App-Name": environment.appName,
    "Content-Type": "application/json; charset=utf-8",
  });

  /**
   * Return query string from object
   * @param obj Object
   * @returns String
   */
  public convertObjectToQueryString(obj: Object) {
    return Object.keys(obj)
      .map((key) => key + "=" + encodeURIComponent(obj[key]))
      .join("&");
  }

  /**
   * Function set model from child class
   */
  public setServiceInfo(serviceInfo) {
    this.apiUrl =
      serviceInfo.apiUrl !== undefined ? serviceInfo.apiUrl : this.apiUrl;
    this.httpClient =
      serviceInfo.httpClient !== undefined
        ? serviceInfo.httpClient
        : this.httpClient;
    inputModelName =
      serviceInfo.inputModelName !== undefined
        ? serviceInfo.inputModelName
        : inputModelName;
    outputModelName =
      serviceInfo.outputModelName !== undefined
        ? serviceInfo.outputModelName
        : outputModelName;
  }

  /**
   * Get data from server
   * @param state DataStateChangeEventArgs
   */
  public getDataFromServer(
    state: DataStateChangeEventArgs,
    params: object = {}
  ): void {
    this.getData(state, params).subscribe((x) => {
      super.next(x);
    });
  }

  /**
   * Get data from server
   * @param state DataStateChangeEventArgs
   * @param params Search data
   */
  public getData(state, params): Observable<DataStateChangeEventArgs> {
    try {
      if (state.action) {
        // Xử lý orderby
        if (state.action.requestType === "sorting") {
          if (state.action.direction) {
            if (state.action.columnName === 'serialNumber') {
              this.orderColumn = 'id';
            } else {
              this.orderColumn = state.action.columnName;
            }
            if (state.action.direction === "Ascending") {
              this.orderValue = "true";
            }
            if (state.action.direction === "Descending") {
              this.orderValue = "false";
            }
          } else {
            this.orderColumn = "";
            this.orderValue = "false";
          }
        }

        // Xử lý tìm kiếm
        if (state.action.requestType === "searching") {
          if (state.search && state.search.length > 0) {
            this.Keyword = state.search[0].key;
          } else {
            this.Keyword = "";
          }
        }
      }

      // Get query string
      let queryString: any = this.convertObjectToQueryString({
        ...params,
        PageSize: state.take,
        PageNumber: state.skip / state.take + 1,
        orderColumn: this.orderColumn,
        orderValue: this.orderValue,
        Keyword: this.Keyword,
      });

      // Get data
      return this.httpClient
        .get(`${this.apiUrl}?${queryString}`)
        .pipe(
          map((response: any) => {
            // Tính toán để ra số thứ tự đúng theo từng trang
            // Trang 1 bắt đầu = 1
            // Trang 2 bắt đầu bằn (2 - 1) * pageZise
            let sumNumber =
              (response.paging.pageNumber - 1) * response.paging.pageSize;

            // Set serial number
            response.items.map((item, index) => {
              item.serialNumber = index + 1 + sumNumber;
            });

            // Format data result
            let dataresult = {
              result: response.items,
              count: response.paging.totalItems,
            } as DataResult;

            return dataresult;
          })
        )
        .pipe((data: any) => {
          return data;
        });
    } catch (error) {

    }
  }
  /**
   * Get data fake
   * @param {String} url File data url.
   */
  public getFakeData(url): Observable<typeof outputModelName[]> {
    return this.httpClient
      .get<typeof outputModelName[]>(url)
      .pipe(catchError(this.errorHandler));
  }

  /**
   * Get all data
   * @returns {Observable}
   */
  public getAll(params = {}): Observable<typeof outputModelName[]> {
    try {
      let queryString = this.convertObjectToQueryString(params);
      return this.httpClient
        .get<typeof outputModelName[]>(`${this.apiUrl}?${queryString}`, {
          headers: this.headers,
        })
        .pipe(catchError(this.errorHandler));
    } catch (error) {

    }
  }

  /**
   * Fetch all data
   * @returns {Promise}
   */
  public getByid(id: any): Observable<typeof inputModelName> {
    try {
      return this.httpClient.get<typeof inputModelName>(`${this.apiUrl}\\${id}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public getDataByUrl(url: string) {
    try {
      return this.httpClient.get(`${this.apiUrl}/${url}`).toPromise();
    } catch (error) {

    }
  }

  /**
   * Add new item into list data
   * @param {Object} body The data input.
   * @returns {Observable}
   */
  public addItem(body: any): Observable<typeof inputModelName> {
    try {
      const localHeader = new HttpHeaders();
      const options = { headers: localHeader };
      return this.httpClient.post<typeof inputModelName>(
        this.apiUrl,
        body,
        options
      );
    } catch (error) {

    }
  }

  /**
   * Update item
   * @param {Any} body Data input.
   * @returns {Observable}
   */
  public updateItem(body: any): Observable<typeof inputModelName> {
    try {
      return this.httpClient.put<typeof inputModelName>(this.apiUrl, body, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  /**
   * Update item
   * @param {Number} id Item id.
   * @returns {Observable}
   */
  public deleteItem(params = {}): Observable<any> {
    try {
      let queryString = this.convertObjectToQueryString(params);
      return this.httpClient.delete<any>(`${this.apiUrl}?${queryString}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  /**
   * Fetch all data
   * @returns {Promise}
   */
  public getFetchAll(params = {}) {
    try {
      let queryString = this.convertObjectToQueryString(params);
      return this.httpClient.get(`${this.apiUrl}?${queryString}`).toPromise();
    } catch (error) {

    }
  }

  /**
   * Catch error from Observable
   * @param {HttpErrorResponse} error Error.
   */
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server error");
  }
}
