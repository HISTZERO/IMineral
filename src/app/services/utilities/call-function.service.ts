import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CallFunctionService {

  private subject = new Subject<any>();

  callFunctionEvent(data: any) {
    this.subject.next(data);
  }

  getCallFunctionEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
