/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  subclass,
  declared,
  property,
} from "esri/core/accessorSupport/decorators";
import Widget from "esri/widgets/Widget";
import { renderable, tsx } from "esri/widgets/support/widget";

import { WidgetItems } from "src/app/shared/constants/map-constants";

const CSS = {
  base: "esri-zoom-box",
  emphasis: "esri-zoom-box--emphasis",
};

@subclass("esri.widgets.ZoomBox")
class ZoomBox extends declared(Widget) {
  constructor(params?: any) {
    super();
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  Service
  //----------------------------------

  @property()
  @renderable()
  service: any;

  //----------------------------------
  //  iconClass
  //----------------------------------

  @property()
  @renderable()
  iconClass: any;

  //----------------------------------
  //  emphasized
  //----------------------------------

  @property()
  @renderable()
  emphasized: boolean = false;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const toolsBox = this.renderToolsBox();
    const classes = {
      [CSS.emphasis]: this.emphasized,
    };

    return <div class={this.classes(CSS.base, classes)}>{toolsBox}</div>;
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private renderToolsBox() {
    return (
      <div class="widget-content">
        <div
          class={`esri-widget--button esri-widget esri-interactive ${
            this.service.currentWidget === WidgetItems.ZOOM_OUT ? "active" : ""
          }`}
          role="button"
          tabindex="0"
          title="Thu nhỏ"
          onclick={() => {
            (this.service.currentWidget = WidgetItems.ZOOM_OUT),
              this.service.startZoomOut();
          }}
        >
          <span
            aria-hidden="true"
            role="presentation"
            class="esri-icon esri-icon-zoom-out-magnifying-glass"
          ></span>
          <span class="esri-icon-font-fallback-text">Thu nhỏ</span>
        </div>
        <div
          class={`esri-widget--button esri-widget esri-interactive ${
            this.service.currentWidget === WidgetItems.ZOOM_IN ? "active" : ""
          }`}
          role="button"
          tabindex="0"
          title="Phóng to"
          onclick={() => {
            (this.service.currentWidget = WidgetItems.ZOOM_IN),
              this.service.startZoomIn();
          }}
        >
          <span
            aria-hidden="true"
            role="presentation"
            class="esri-icon esri-icon-zoom-in-magnifying-glass"
          ></span>
          <span class="esri-icon-font-fallback-text">Phóng to</span>
        </div>
        <div
          class={`esri-widget--button esri-widget esri-interactive ${
            this.service.currentWidget === WidgetItems.PAN ? "active" : ""
          }`}
          role="button"
          tabindex="0"
          title="Di chuyển"
          onclick={() => {
            (this.service.currentWidget = WidgetItems.PAN),
              this.service.enableViewPanning();
          }}
        >
          <span
            aria-hidden="true"
            role="presentation"
            class="esri-icon esri-icon-pan"
          ></span>
          <span class="esri-icon-font-fallback-text">Di chuyển</span>
        </div>
      </div>
    );
  }
}

export default ZoomBox;