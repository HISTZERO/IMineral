import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as cloneDeep from 'lodash/cloneDeep';
import {
  TreeGridComponent,
  RowDDService,
  SelectionService,
  ToolbarService
} from "@syncfusion/ej2-angular-treegrid";

import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";

@Component({
  selector: "app-layer-tree",
  templateUrl: "./layer-tree.component.html",
  styleUrls: ["./layer-tree.component.scss"],
  providers: [RowDDService, SelectionService, ToolbarService],
})
export class LayerTreeComponent implements OnInit, OnChanges {
  // Input
  @Input() selectedItem: any;
  @Input() actionType: string;
  @Input() parentItemSelected: any;
  @Input() dtSource: Object[] = [];
  @Input() dataSource: Object[] = [];
  @Input() selectedChildIds: number[] = [];
  @Input() selectedParentIds: number[] = [];
  @Input() fullCheck: boolean = false;
  @Input() notDisplayIcon: boolean = false;
  @Input() onlyOneChecked: boolean = false;
  @Input() allowRowDragAndDrop: boolean = false;

  // Output
  @Output() rowDrop = new EventEmitter<string>();
  @Output() rowDataBound = new EventEmitter<string>();

  // TreeGrid toolbar
  public toolbarOption: string[];

  @ViewChild("treeGrid", { static: false }) treeGrid: TreeGridComponent;
  constructor(
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared
  ) { }

  ngOnInit() {
    this.toolbarOption = ['Search'];
    this.dtSource = cloneDeep(this.dataSource);
  }

  ngOnChanges(args: SimpleChanges) {
    if (args.dataSource && args.dataSource.currentValue && this.treeGrid) {
      this.treeGrid.dataSource = cloneDeep(args.dataSource.currentValue);
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Hàm kích hoạt sự kiện khi người dùng check vào checkbox
   * @param args - Trả về đối tượng được check
   */
  async checkboxChange(args: any) {
    // Format dữ liệu
    this.selectedChildIds = [];
    this.selectedParentIds = [];

    // Lấy tất cả record được check
    let checkedRecords = this.treeGrid.getCheckedRecords();

    // Danh sách tất cả các records
    let currentViewRecords = this.treeGrid.flatData;

    // Nếu có option chỉ được chọn 1
    // Xóa những item checked khác
    if (this.onlyOneChecked) {
      checkedRecords.map((record: any) => {
        if (args.rowData.index !== record.index && !record.childs)
          this.treeGrid.selectCheckboxes([record.index]);
      });
    }

    // Gọi hàm để lấy danh sách id của các item được check
    await this.getSelectedItemIds(checkedRecords);

    // Trả dữ liệu về cho parent component
    this.nextDataBound({
      rowData: args.rowData,
      eventName: "checkboxChange",
      checkedRecords: checkedRecords,
      currentViewRecords: currentViewRecords,
      selectedChildIds: this.selectedChildIds,
      selectedParentIds: this.selectedParentIds,
    });
  }

  /**
   * Hàm lấy danh sách ids của các item được check
   * @param checkedRecords Các item đã được check
   */
  getSelectedItemIds(checkedRecords: any) {
    checkedRecords.map((record: any) => {
      // Record is disabled
      let isDisableRecord =
        this.treeGrid
          .getRowByIndex(record.index)
          .getElementsByClassName("e-rowcell")[0]
          .parentElement.className.indexOf("disablecheckbox") === -1;

      // Không thực hiện các bước tiếp theo
      // nếu record bị disabled
      if (!isDisableRecord) return;

      if (record.childs && record.childs.length > 0) {
        this.selectedParentIds.push(record.id);
      } else {
        this.selectedChildIds.push(record.id);
      }
    });
  }

  /**
   * Hàm kích hoạt sự kiện khi người dùng click vào button
   * @param rowData - Đối tượng đang được click
   * @param eventName - Tên sự kiện click
   */
  async action(rowData: any, eventName: string, event: Event) {
    if (event) event.stopPropagation();

    // Return 
    await this.nextDataBound({
      rowData: rowData,
      eventName: eventName,
      currentViewRecords: this.treeGrid.flatData,
    });
  }

  /**
   * Hàm trả dữ liệu về cho parent component
   * @param data - Đối tượng trả về
   */
  nextDataBound(data: any) {
    this.rowDataBound.next(data);
  }

  /**
   * Hàm được kích hoạt ban đầu khi render dữ liệu
   * @param args Row
   */
  async treeGridRowDataBound(args: any) {
    // Row hiện tại
    let currentIndex = args.data.index;

    // Tổng row
    let totalRows = this.treeGrid.flatData.length;

    // Danh sách tất cả các records
    let currentViewRecords = this.treeGrid.flatData;

    // Nếu chưa phải row cuối cùng thì dừng lại
    if (currentIndex + 1 !== totalRows) return;

    // Delay 500ms
    await this.delay(500);

    // Tự động check vào row nếu type == checkbox
    if (this.actionType === "checkbox") this.executeCheckRow();

    // Trả về các tham số khi hiển thị item cuối
    this.nextDataBound({
      eventName: "allRowsHasBeenDisplayed",
      currentViewRecords: currentViewRecords,
      checkedRecords: this.treeGrid.getCheckedRecords(),
    });
  }

  /**
   * Sự kiện khi người dùng select row
   * @param args Row
   */
  treeGridRowSelected(args: any) {
    this.nextDataBound({
      eventName: "treeGridRowSelected",
      rowData: args.data,
    });
  }

  /**
   * Kiểm tra và check vào checkbox
   */
  executeCheckRow() {
    // Khi row drop thì không được gọi lại hàm check row
    if (this.isTreeGridRowDropAction) {
      this.isTreeGridRowDropAction = false;
      return;
    }

    this.treeGrid.flatData.map((item: any, index) => {
      // Nếu item id thỏa mãn 1 trong 3 điều kiện
      // 1, Nằm trong mảng selectedParentIds ||
      // 2, Nằm trong mảng selectedChildIds ||
      // 3, Trạng thái fullCheck
      if (
        item.checkboxState !== "check" &&
        (this.selectedParentIds.indexOf(item.id) !== -1 ||
          this.selectedChildIds.indexOf(item.id) !== -1 ||
          this.fullCheck)
      ) {
        // Check vào checkbox
        this.treeGrid.selectCheckboxes([index]);

        if (this.parentItemSelected && this.parentItemSelected.childs) {
          // Kiểm tra item có phải là
          // con của parentItemSelected
          let isChild =
            this.parentItemSelected.childs
              .map((child) => {
                return child.id;
              })
              .indexOf(item.id) !== -1;

          // Vô hiệu checkbox khi các item
          // con không thuộc parentItemSelected
          if (!isChild) {
            this.treeGrid
              .getRowByIndex(index)
              .getElementsByClassName("e-rowcell")[0].parentElement.className +=
              " disablecheckbox";
          }
        }
      }
    });
  }

  // Lưu sự kiện row drop
  public isTreeGridRowDropAction = false;

  /**
   * Sự kiện khi thả row (lúc kéo thả)
   * @param args Row
   */
  async treeGridRowDrop(args: any) {

    // Delay 500ms
    this.delay(500);

    // Đánh dấu là đã kích hoạt sự kiện row drop
    this.isTreeGridRowDropAction = true;

    // Callback
    this.nextDataBound({
      eventName: "treeGridRowDrop",
    });
  }
}
