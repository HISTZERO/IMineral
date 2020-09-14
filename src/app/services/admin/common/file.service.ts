import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class FileService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: null,
      outputModelName: null,
      apiUrl: environment.apiIMineral + ServiceName.FILE + ServiceName.UPLOADFILE,
    });
  }

  /**
   * Hàm download file
   */
  public downloadFile() {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.FILE + ServiceName.DOWNFILE,
    });
    return this.getAll();
  }

  /**
   * Hàm xóa file
   */
  public deleteFile() {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.FILE + ServiceName.DELETEFILE,
    });
    return this.deleteItem();
  }

  /**
   * Check delete
   * @param id
   */
  public checkBeDeleted(id: string) {
    return "ok";
  }
}
