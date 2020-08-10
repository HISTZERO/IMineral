import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HethonglogService} from "./hethonglog.service";

@Injectable({
  providedIn: "root",
})
export class HethongFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Service hệ thống log service
  public getHeThongLogService() {
    return new HethonglogService(this.httpClient);
  }
}
