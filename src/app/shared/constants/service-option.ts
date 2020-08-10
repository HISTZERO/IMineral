
import {HttpHeaders} from '@angular/common/http';
// tslint:disable-next-line:class-name
export class ServiceOption {
  constructor() {}
  public static getOption() {
    const h = new HttpHeaders({
      'Content-Type': 'application/json'});
    const options = {headers: h};
    return options;
  }
}
