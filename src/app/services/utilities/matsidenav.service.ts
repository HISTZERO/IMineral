import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class MatsidenavService {
  private sidenav: MatSidenav;
  public sidenavTitle: string;
  public contentComp: any;
  public parentComp: any;

  private compRef: ComponentRef<any>;
  public confirmStatus: string;
  public okCallBackFunction: string;
  public cancelCallBackFunction: string;
  public currentModelData: any;
  public purpose: string;
  private vcf: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver
  ) { }
  public setSidenav(sidenav: MatSidenav, parentComp: any, vcf: ViewContainerRef, cfr: ComponentFactoryResolver) {
    this.sidenav = sidenav;
    this.vcf = vcf;
    this.cfr = cfr;
    this.parentComp = parentComp;
  }

  public open(): void {
    this.sidenav.open();
  }


  public close(): void {
    this.sidenav.close();
    if (this.confirmStatus === 'doOKFunction') {
      if (this.okCallBackFunction) {
        this.parentComp.doFunction(this.okCallBackFunction);
      } else {
        console.log('Please set the okCallBackFunction');
      }
    } else if (this.confirmStatus === 'doCancelFunction') {
      if (this.cancelCallBackFunction) {
        this.parentComp.doFunction(this.cancelCallBackFunction);
      } else {
        console.log('Please set the cancelCallBackFunction');
      }
    }
  }

  public doParentFunction(fname: string, resultData: any = {}) {
    this.parentComp.doFunction(fname, resultData);
  }

  public toggle(): void {
    this.sidenav.toggle();
  }

  public setContentComp(comp: any, purpose?: string, obj?: any) {
    this.contentComp = comp;
    const factory = this.cfr.resolveComponentFactory(this.contentComp);
    this.vcf.clear();
    this.compRef = this.vcf.createComponent(factory, 0);
    if (obj) {
      this.compRef.instance.obj = obj;
    }
    if (purpose) {
      this.compRef.instance.purpose = purpose;
    }
    return this.compRef;
  }

  public setTitle(title: string) {
    this.sidenavTitle = title;
  }
}
