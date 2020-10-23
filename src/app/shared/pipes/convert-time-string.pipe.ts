import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "convertTimeString",
})
export class ConvertTimeString implements PipeTransform {
  transform(value: string, args?: string): any {
    switch (args || null) {
      // Lấy ra dữ liệu dạng ngày tháng năm
      case "datetime":
        if (value) {
          const [date, hour]: string[] = value.split("T");
          if (date) {
            const [year, month, day]: string[] = date.split("-");
            if (year.length === 4) {
              const datetiime = `${day}/${month}/${year}`;
              return datetiime;
            } else {
              const datetiime = `${year}/${month}/${day}`;
              return datetiime;
            }
          } else {
            return null;
          }
        }
      // Lấy ra dữ liệu dạng giờ
      case "hour":
        if (value) {
          const [date1, hour1]: string[] = value.split(" ");
          if (hour1) {
            return hour1;
          } else {
            return null;
          }
        }
      default:
        return null;
    }
  }
}
