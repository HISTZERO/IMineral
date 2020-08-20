import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyAlertDialogComponent } from 'src/app/shared/components/my-alert-dialog/my-alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceShared {

  // Các biến translate
  dataTranslate: any;

  constructor(
    public snackBar: MatSnackBar,
    public modalDialog: MatDialog,
    public titlecasePipe: TitleCasePipe,
    private translate: TranslateService
  ) {
    translate.getTranslation(translate.getDefaultLang()).subscribe(
      res => { this.dataTranslate = res; }
    );
  }

  // Delete key belong to object
  // but not belong to form value
  public mapObjectAndForm(object, form) {

    // Undefined object
    if (object === null || object === undefined) return object;

    // Remove key belong to object
    // but not belong form value
    Object.keys(object).map(key => {
      if (form.value[key] === undefined) {
        delete object[key];
      }
    });

    // Return object with keys
    // is same form value
    return object;
  }

  // show notification
  public showeNotiResult(contentText: string, duration: number) {
    return this.snackBar.open(contentText, '', {
      // tslint:disable-next-line: object-literal-shorthand
      duration: duration,
    });
  }

  // show error httpErrorResponse
  public showError(errorResponese: any) {
    if (errorResponese.error instanceof Error) {
      this.showeNotiResult(errorResponese.error.message, 2000);
    } else {
      this.showeNotiResult(errorResponese.error, 2000);
    }
  }

  // transforName
  public transforName(text: string) {
    let data = this.titlecasePipe.transform(text);
    let message = data.split(' ');
    let resutl = '';
    message.forEach(x => {
      let ss = x.trim();
      if (!(ss === '')) {
        resutl = resutl + ss + ' ';
      }
    });

    return resutl;
  }

  // checkValue
  checkValue(str, max) {
    if (str.charAt(0) !== '0' || str == '00') {
      let num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) {
        num = 1;
      }
      str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
    }

    return str;
  }

  // innit date format
  initDateFormatddMMyyyy(date) {

    const componet = this;
    // tslint:disable-next-line:only-arrow-functions
    date.addEventListener('input', function (e) {
      this.type = 'text';
      let input = this.value;
      if (/\D\/$/.test(input)) {
        input = input.substr(0, input.length - 3);
      }
      const values = input.split('/').map(function (v) {
        return v.replace(/\D/g, '');
      });
      if (values[0]) {
        values[0] = componet.checkValue(values[0], 12);
      }
      if (values[1]) {
        values[1] = componet.checkValue(values[1], 31);
      }
      const output = values.map(function (v, i) {
        return v.length == 2 && i < 2 ? v + ' / ' : v;
      });
      this.value = output.join('').substr(0, 14);
    });

    // blur
    date.addEventListener('blur', function (e) {
      this.type = 'text';
      const input = this.value;
      const values = input.split('/').map(function (v, i) {
        return v.replace(/\D/g, '');
      });
      let output = '';

      if (values.length == 3) {
        const year = values[2].length !== 4 ? parseInt(values[2]) + 2000 : parseInt(values[2]);
        const month = parseInt(values[0]) - 1;
        const day = parseInt(values[1]);
        const d = new Date(year, month, day);
        if (d) {
          //document.getElementById('result').innerText = d.toString();
          const dates = [d.getDate(), d.getMonth() + 1, d.getFullYear()];
          output = dates.map(function (v) {
            const sv = v.toString();
            return sv.length == 1 ? '0' + v : v;
          }).join(' / ');
        }
      }

      this.value = output;
    });
  }

  // confirm delete dialog
  public confirmDeleteDiaLogService(titleText: string, nameObj: string, titleHeader?: string) {
    const dialogRef = this.modalDialog.open(MyAlertDialogComponent);
    dialogRef.componentInstance.header = titleHeader ? titleHeader : this.dataTranslate.COMMON.default.deleteSub;
    dialogRef.componentInstance.content = titleText + ' <b>' + nameObj + '</b>';
    dialogRef.componentInstance.okeButton = this.dataTranslate.COMMON.default.success;
    dialogRef.componentInstance.cancelButton = this.dataTranslate.COMMON.default.cancel;
    dialogRef.componentInstance.visibleOkButton = true;
    dialogRef.componentInstance.visibleCancelButton = true;
    return dialogRef;
  }

  // canDeleteDialog
  public canDeleteDialogService(sMsg: string) {
    const dialogRef = this.modalDialog.open(MyAlertDialogComponent);
    dialogRef.componentInstance.header = this.dataTranslate.COMMON.default.canNotDelete;
    dialogRef.componentInstance.content = sMsg;
    dialogRef.componentInstance.cancelButton = this.dataTranslate.COMMON.default.close;
    dialogRef.componentInstance.visibleOkButton = false;
    dialogRef.componentInstance.visibleCancelButton = true;
    dialogRef.componentInstance.headerColor = 'red';
  }

  // get select item by id
  public getByEvent(event, lisData: any) {
    const target = event.currentTarget;
    const pElement = target.parentElement.parentElement;
    const pclassId = pElement.getAttribute('id');
    return lisData.find(f => f.id === +pclassId);
  }
}
