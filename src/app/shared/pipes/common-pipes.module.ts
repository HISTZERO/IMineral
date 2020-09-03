import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GetFieldValueFromArrayObjectPipe } from "src/app/shared/pipes/get-field-value-from-array-object.pipe";
import { SafeHTML } from "src/app/shared/pipes/safe-html.pipe";
import { ConvertTimeString } from "src/app/shared/pipes/convert-time-string.pipe";
import { GetNameFileConstantPipe } from 'src/app/shared/pipes/get-name-file-constant.pipe';
import { GetNameNhomkhoangsanPipe } from 'src/app/shared/pipes/get-name-nhomkhoangsan.pipe';
import { GetNameLinhVucPipe } from 'src/app/shared/pipes/get-name-linhvuc.pipe';
import { GetNameCapQuanLyPipe } from 'src/app/shared/pipes/get-name-capquanly.pipe';

@NgModule({
  declarations: [	
    GetFieldValueFromArrayObjectPipe,
    ConvertTimeString,
    SafeHTML,
    GetNameFileConstantPipe,
    GetNameNhomkhoangsanPipe,
    GetNameLinhVucPipe,
    GetNameCapQuanLyPipe
   ],
  imports: [CommonModule],
  exports: [
    GetFieldValueFromArrayObjectPipe,
    ConvertTimeString,
    SafeHTML,
    GetNameFileConstantPipe,
    GetNameNhomkhoangsanPipe,
    GetNameLinhVucPipe,
    GetNameCapQuanLyPipe
  ],
})
export class CommonPipesModule { }
