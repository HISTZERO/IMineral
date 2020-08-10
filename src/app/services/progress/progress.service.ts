import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  visibility: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(false);
  }

  show() {
    if (!this.visibility.value) {
      this.visibility.next(true);
    }
  }

  hide(lastRequests: any[]) {
    // Tìm các request đã hoàn thành (finalize === true)
    let finalizeRequest = lastRequests.filter((request) => {
      return request.finalize === true;
    });

    // Kiểm tra xem các request đã hoàn thành ?
    // Nếu các request đã hoàn thành thì ẩn progress bar
    if (finalizeRequest.length === lastRequests.length) {
      setTimeout(() => {
        if (this.visibility.value) {
          this.visibility.next(false);
        }
      }, 500);
    }
  }
}
