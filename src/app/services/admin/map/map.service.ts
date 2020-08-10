import { HttpClient } from "@angular/common/http";

import {
  InputMapModel,
  OutputMapModel,
} from "src/app/models/admin/map/map.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

export class MapService extends RepositoryEloquentService {

  // Api url
  public mapApiUrl: string = `${environment.apiMapURL}${ServiceName.MAP}`;

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputMapModel(),
      outputModelName: new OutputMapModel(),
      apiUrl: environment.apiMapURL + ServiceName.MAP,
    });
  }

  public saveLayerAndGroup(params: any) {
    let apiUrl: string = `${this.mapApiUrl}/layer-and-layerGroup`;
    this.setServiceInfo({ apiUrl });
    return this.addItem(params);
  }

  async getLayerAndGroup(mapId: number) {

    // Lấy danh sách layer và group
    this.setServiceInfo({ apiUrl: `${this.mapApiUrl}/layer-and-layerGroup/${mapId}` });
    let mapLayersAndGroups: any = await this.getFetchAll();

    // Format
    mapLayersAndGroups = [...mapLayersAndGroups.mapLayerGroups, ...mapLayersAndGroups.mapLayers];

    // Lưu dạng key value
    let mapLayersAndGroupsByGuid: any = {};
    mapLayersAndGroups.map(item => { mapLayersAndGroupsByGuid[item.guid] = item });

    return mapLayersAndGroupsByGuid;
  }

  public getMapByMapId(id: number) {
    let apiUrl: string = `${this.mapApiUrl}/${id}`;
    this.setServiceInfo({ apiUrl });
    return this.getFetchAll({});
  }

  /**
   * Hàm lấy danh sách nhóm lớp và lớp của bản đồ
   * @param mapId Id bản đồ
   */
  async getAllLayerAndLayerGroup(mapId: number) {
    // Lấy danh sách lớp và nhóm lớp của bản đồ
    let resultGetMapLayers: any = await this.getMapLayers(mapId);
    let resultGetTreeLayerGroup: any = await this.getTreeLayerGroup(
      mapId,
      resultGetMapLayers.mapLayers
    );

    // Những lớp không thuộc nhóm lớp
    resultGetTreeLayerGroup.treeLayerGroup.push(
      ...resultGetMapLayers.mapLayers.filter((mapLayer) => {
        return !mapLayer.mapLayer_LayerGroupId;
      })
    );

    // Trả về kết quả
    return {
      treeLayerGroup: resultGetTreeLayerGroup.treeLayerGroup,
      selectedChildIds: resultGetMapLayers.selectedChildIds,
      selectedParentIds: resultGetTreeLayerGroup.selectedParentIds,
    };
  }

  /**
   * Hàm để lấy danh sách layer của bản đồ
   * @param mapId Id của bản đồ
   */
  async getMapLayers(mapId) {
    // Gán link api
    this.setServiceInfo({
      apiUrl:
        environment.apiMapURL +
        ServiceName.MAPLAYER +
        "/get-all-mapLayer-layer-by-mapId/" +
        mapId,
    });

    // Lưu ids của các lớp đã được chọn
    let selectedChildIds: any[] = [];

    // Lấy danh sách map layers và định dạng dữ liệu
    let mapLayers: any = await this.getFetchAll();
    mapLayers.map((mapLayer) => {
      selectedChildIds.push(mapLayer.id);
      mapLayer.type = "layer";
      mapLayer.rowId = mapLayer.mapLayer_Id;
      mapLayer.name = mapLayer.mapLayer_LayerTitle;
    });

    return {
      mapLayers: mapLayers,
      selectedChildIds: selectedChildIds,
    };
  }

  /**
   * Lấy danh sách các nhóm lớp của bản đồ
   * => Chuyển nó về dạng cây
   * @param mapId Id bản đồ
   */
  async getTreeLayerGroup(mapId, mapLayers) {
    // Gán link api
    this.setServiceInfo({
      apiUrl: environment.apiMapURL + ServiceName.MAPLAYERGROUP + "/" + mapId,
    });

    // Lấy danh sách các group thuộc bản đồ
    let result: any = await this.getFetchAll();
    let items = result === null ? [] : result;

    // Lưu ids của các nhóm lớp đã được chọn
    let selectedParentIds: any[] = [];

    items.map((item) => {
      // Gán lại giá trị cho nhóm lớp
      item.type = "group";
      item.rowId = item.id;
      item.id = item.laygroupId;
      item.name = item.mapLayerGroupName;
      item.parentId = item.layerGroupParentId;

      // Danh sách nhóm lớp đã được select
      selectedParentIds.push(item.id);

      // Danh sách layers của nhóm lớp
      item.childs = mapLayers.filter((mapLayer) => {
        return mapLayer.mapLayer_LayerGroupId === item.id;
      });
    });

    return {
      selectedParentIds: selectedParentIds,
      treeLayerGroup: this.transferListToTree(items),
    };
  }

  /**
   * Hàm để thay đổi định dạng danh sách thành cây
   * @param items Danh sách đối tượng
   */
  transferListToTree(items) {
    // Danh sách item có parentId = null
    let itemsTree: Object[] = items.filter((item: any) => {
      return item.parentId === null;
    });

    // Lặp qua các item có parentId = null
    itemsTree.map((item: any) => {
      this.recursiveFindChild(item, items);
    });

    return itemsTree;
  }

  /**
   *
   * @param item Đối tượng cần tìm kiếm
   * @param items Danh sách tất cả các đối tượng
   */
  recursiveFindChild(item, items) {
    // Tìm kiếm các đối tượng con của item
    // Lấy giá trị tìm kiếm được gán cho mảng childs
    item.childs.push(
      ...items.filter((_item) => {
        return item.id === _item.parentId;
      })
    );

    // Lặp qua từng childs của param đối tượng
    item.childs.map((_item) => {
      if (_item.type === "group") {
        this.recursiveFindChild(_item, items);
      }
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
