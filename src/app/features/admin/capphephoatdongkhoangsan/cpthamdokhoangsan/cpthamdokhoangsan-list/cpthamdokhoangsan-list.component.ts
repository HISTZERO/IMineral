import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NhomLoaiGiayPhepEnum } from 'src/app/shared/constants/nhomloaigiayphep-constants';
import { MenuCpThamDoKhoangSan } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';

@Component({
  selector: 'app-cpthamdokhoangsan-list',
  templateUrl: './cpthamdokhoangsan-list.component.html',
  styleUrls: ['./cpthamdokhoangsan-list.component.scss']
})
export class CpthamdokhoangsanListComponent implements OnInit {
  // nhóm loại cấp phép enum
  NhomLoaiGiayPhepType = NhomLoaiGiayPhepEnum;

  // title danh sách hồ sơ
  title: string;

  // Chứa menu item trên subheader
  public navArray = MenuCpThamDoKhoangSan;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(private translate: TranslateService) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    this.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.capphepthamdokhoangsan.titleList;
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
