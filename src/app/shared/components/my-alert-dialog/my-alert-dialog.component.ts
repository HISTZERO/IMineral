import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-alert-dialog',
  templateUrl: './my-alert-dialog.component.html',
  styleUrls: ['./my-alert-dialog.component.scss']
})
export class MyAlertDialogComponent implements OnInit {
  constructor() { }
  header = 'Thông báo';
  content = '';
  okeButton = 'Đồng ý';
  cancelButton = 'Hủy bỏ';
  visibleOkButton = true;
  visibleCancelButton = true;
  headerColor = 'black';
  ngOnInit() {
  }


  public showUpdateResultDialog(contentText: string) {
    this.header = 'Thông báo';
    this.content = contentText;
    this.okeButton = 'Đồng ý';
    this.cancelButton = 'Hủy bỏ';
    this.visibleOkButton = true;
    this.visibleCancelButton = false;
    this.headerColor = 'black';
  }
}
