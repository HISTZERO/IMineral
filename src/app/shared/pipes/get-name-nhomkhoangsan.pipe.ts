import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getNameNhomKhoangSan'
})
export class GetNameNhomkhoangsanPipe implements PipeTransform {

  transform(value: any, objArray: any): string {
    let str = "";
    objArray.map((obj) => {
      if (obj.idnhomkhoangsan === value) {
        str = obj.tennhomkhoangsan;
      }
    });
    return str;
  }

}
