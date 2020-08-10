import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GetFieldValueFromArrayObjectPipe } from "src/app/shared/pipes/get-field-value-from-array-object.pipe";
import { SafeHTML } from "./safe-html.pipe";
import { ConvertTimeString } from "src/app/shared/pipes/convert-time-string.pipe";

@NgModule({
  declarations: [
    GetFieldValueFromArrayObjectPipe,
    ConvertTimeString,
    SafeHTML,
  ],
  imports: [CommonModule],
  exports: [
    GetFieldValueFromArrayObjectPipe,
    ConvertTimeString,
    SafeHTML,
  ],
})
export class CommonPipesModule { }
