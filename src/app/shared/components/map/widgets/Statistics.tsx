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
  base: "esri-statistics",
  emphasis: "esri-statistics--emphasis",
};

@subclass("esri.widgets.Statistics")
class FeatureInfo extends declared(Widget) {
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
            this.service.currentWidget === WidgetItems.STATISTICS
              ? "active"
              : ""
          }`}
          role="button"
          tabindex="0"
          title="Thống kê"
          onclick={() => {
            (this.service.currentWidget = WidgetItems.STATISTICS),
              this.service.enableViewPanning();
          }}
        >
          <span
            aria-hidden="true"
            role="presentation"
            class={`esri-icon ${this.iconClass}`}
          ></span>
          <span class="esri-icon-font-fallback-text">Thống kê</span>
        </div>
      </div>
    );
  }
}

export default FeatureInfo;