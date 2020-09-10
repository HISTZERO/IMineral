import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HethonglogService} from "./hethonglog.service";
import { HsCoquantiepnhanService } from './coquantiepnhan.service';

@Injectable({
  providedIn: "root",
})
export class HethongFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Service hệ thống log service
  public getHeThongLogService() {
    return new HethonglogService(this.httpClient);
  }
  // Service cấu hình cơ quân tiếp nhận
  public getCoQuanTiepNhanService() {
    return new HsCoquantiepnhanService(this.httpClient);
  }
}
