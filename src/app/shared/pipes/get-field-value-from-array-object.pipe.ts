import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getFieldValueFromArrayObject",
})
export class GetFieldValueFromArrayObjectPipe implements PipeTransform {
  transform(value: number, arrObject, fieldName: string): string {
    let str = "";
    arrObject.map((obj) => {
      if (obj.index === value) {
        str = obj[fieldName];
      }
    });
    return str;
  }
}
