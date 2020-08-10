/*
Material Dialog Service: Dùng để khởi tạo matdialog tại bất cứ một component nào với nội dung Dialog là component khác được truyền vào
Component nơi khởi tạo Service này gọi là: Component cha
Component nội dung của Service này gọi là: Component con.
Cách sử dụng:
1. Tại Component cha phải Import MatDialog và Service này: MatdialogService
2. Tại Component cha phải có hàm doFunction:
      doFunction(methodName) {
        this[methodName]();
      }
3.Tại Constructor của Component cha phải truyền vào 2 biến MatDialog và MatdialogService và khởi tạo như ví dụ sau:
      constructor(private imDialog: MatDialog, imDialogService: MatdialogService) {
        this.mDialog = imDialogService;
        this.mDialog.initDialg(imDialog);
      }
4. Tại hàm mở Dialog phải gọi hàm setDialog của MatdialogService trước sau đó mới gọi hàm open. Ví dụ:
      public showMatDialog() {
        this.mDialog.setDialog(this, WrComponent,'logTest','logTest2', {panelClass: 'assets-custom-dialog-container', disableClose: true});
        this.mDialog.open();
      }
 */
import {Injectable} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Injectable()
export class MatdialogService {
  private mdialog: MatDialog;
  public mdialogRef: any;
  public contentComp: any;
  public parentComp: any;
  public dataModel: any;
  public flag: number;
  public width: string;
  public height: string;
  public dataResult: any;
  public okCallBackFunction: string;
  public cancelCallBackFunction: string;

  //Hàm khởi tạo MatDialog của Service
  public initDialg(mdialog: MatDialog) {
    this.mdialog = mdialog;
  }

  //Hàm gọi và đặt các tham số đầu vào cho Service
  public setDialog(parentComp: any, contentComp: any, okF?: string, cancelF?: string, dataModel?: any, width?: string, height?: string, flag?: number) {
    this.okCallBackFunction = null;
    this.cancelCallBackFunction = null;
    this.dataModel = null;
    this.dataResult = null;
    this.flag = null;
    this.width = '';
    this.height = '';
    this.parentComp = parentComp;
    this.contentComp = contentComp;
    if (okF) {
      this.okCallBackFunction = okF;
    }
    if (cancelF) {
      this.cancelCallBackFunction = cancelF;
    }
    if (dataModel) {
      this.dataModel = dataModel;
    }
    if (flag) {
      this.flag = flag;
    }
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }
  }

  public open(): void {
    this.mdialogRef = this.mdialog.open(this.contentComp, {data: {model: this.dataModel}, width: this.width, height: this.height });
    this.mdialogRef.afterClosed().subscribe(async result => {
      if (!result === false) {
        if (this.okCallBackFunction != null) {
          this.parentComp.doFunction(this.okCallBackFunction);
        }
      } else {
        if (!result === true) {
          if (this.cancelCallBackFunction != null) {
            this.parentComp.doFunction(this.cancelCallBackFunction);
          }
        }
      }
    });
  }

  constructor() {
  }
}
