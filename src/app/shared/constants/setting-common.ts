import {
  PageSettingsModel,
  ToolbarItems,
  EditSettingsModel
} from "@syncfusion/ej2-angular-grids";

export class SettingsCommon {
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[] = ["Search"];
  public pageSettings: PageSettingsModel = { pageSize: 40, pageCount: 5 };
}

export class ThietLapHeThong {
  public static listPageSize = "listPageSize";
  public static mediaPageSize = "mediaPageSize";
  public static defaultPageSize = "defaultPageSize";
}