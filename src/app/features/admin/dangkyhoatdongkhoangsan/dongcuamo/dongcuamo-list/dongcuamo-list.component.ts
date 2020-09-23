import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuDkDongCuaMo } from "src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan";
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";

@Component({
  selector: 'app-dongcuamo-list',
  templateUrl: './dongcuamo-list.component.html',
  styleUrls: ['./dongcuamo-list.component.scss']
})
export class DongcuamoListComponent implements OnInit {

  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuDkDongCuaMo;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dongcuamo.titleList;
  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }


}
