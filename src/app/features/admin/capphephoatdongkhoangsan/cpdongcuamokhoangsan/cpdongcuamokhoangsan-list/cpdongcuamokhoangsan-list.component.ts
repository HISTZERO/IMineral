import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NhomLoaiCapPhepEnum } from 'src/app/shared/constants/nhomloaicapphep-constants';
import { MenuCpDongCuaMoKhoangSan } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';

@Component({
  selector: 'app-cpdongcuamokhoangsan-list',
  templateUrl: './cpdongcuamokhoangsan-list.component.html',
  styleUrls: ['./cpdongcuamokhoangsan-list.component.scss']
})
export class CpdongcuamokhoangsanListComponent implements OnInit {
  // nhóm loại cấp phép enum
  NhomLoaiCapPhepType = NhomLoaiCapPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuCpDongCuaMoKhoangSan;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdongcuamokhoangsan.titleList;
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
