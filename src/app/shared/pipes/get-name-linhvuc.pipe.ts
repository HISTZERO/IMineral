import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getNameLinhVucPipe'
})
export class GetNameLinhVucPipe implements PipeTransform {

  transform(value: any, objArray: any): string {
    let str = "";
    objArray.map((obj) => {
      if (obj.idlinhvuc === value) {
        str = obj.tenlinhvuc;
      }
    });
    return str;
  }

}
