import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getNameLoaiKhuVucKhoangSanPipe'
})
export class GetNameLoaiKhuVucKhoangSanPipe implements PipeTransform {

  transform(value: any, objArray: any): string {
    let str = "";
    objArray.map((obj) => {
      if (obj.id === value) {
        str = obj.name;
      }
    });
    return str;
  }

}
