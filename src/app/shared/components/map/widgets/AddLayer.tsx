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
  base: "esri-add-layer",
  emphasis: "esri-add-layer--emphasis",
};

@subclass("esri.widgets.AddLayer")
class AddLayer extends declared(Widget) {
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
  //  Widget
  //----------------------------------

  @property()
  @renderable()
  widget: any;

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
            this.service.currentWidget === WidgetItems.ADD_LAYER
              ? "active"
              : ""
            }`}
          role="button"
          tabindex="0"
          title="Thêm lớp"
          onclick={() => {
            (this.service.currentWidget = WidgetItems.ADD_LAYER),
              this.widget.mapDetailComponent.openLayerDialog();
          }}
        >
          <span
            aria-hidden="true"
            role="presentation"
            class={`esri-icon ${this.iconClass}`}
          ></span>
          <span class="esri-icon-font-fallback-text">Thêm lớp</span>
        </div>
      </div>
    );
  }
}

export default AddLayer;
