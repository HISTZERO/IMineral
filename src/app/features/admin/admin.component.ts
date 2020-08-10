import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {

  public containerClass: string = "navbar-top";

  constructor(public authService: AuthService) { }
  ngOnInit() {
  }

  toggleSidebar() {
    if (this.containerClass === "navbar-top") {
      this.containerClass += " sidebar-xs"
    } else {
      this.containerClass = "navbar-top";
    }
  }
}
