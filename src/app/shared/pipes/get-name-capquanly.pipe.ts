import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getNameCapQuanLyPipe'
})
export class GetNameCapQuanLyPipe implements PipeTransform {

  transform(value: any, objArray: any): string {
    let str = "";
    objArray.map((obj) => {
      if (obj.idcapquanly === value) {
        str = obj.tencapquanly;
      }
    });
    return str;
  }

}
