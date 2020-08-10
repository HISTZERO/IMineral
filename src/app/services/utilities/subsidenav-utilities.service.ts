import {
  Injectable,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef
} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SubsidenavUtilitiesService {
  public listdlthamsotram: any;
  public contentComp: any;
  private vcf: ViewContainerRef;
  private cfr: ComponentFactoryResolver;
  private compRef: ComponentRef<any>;
  public parentComp: any;
  constructor() {}

  public setSubnavUtilities(
    parentComp: any,
    vcf: ViewContainerRef,
    cfr: ComponentFactoryResolver
  ) {
    this.vcf = vcf;
    this.cfr = cfr;
    this.parentComp = parentComp;
  }

  public setContentComp(comp: any, obj?: any) {
    this.contentComp = comp;
    const factory = this.cfr.resolveComponentFactory(this.contentComp);
    this.vcf.clear();
    this.compRef = this.vcf.createComponent(factory, 0);
    if (obj) {
      this.compRef.instance.obj = obj;
    }
    return this.compRef;
  }

  public doParentFunction(fname: string) {
    this.parentComp.doFunction(fname);
  }
}
