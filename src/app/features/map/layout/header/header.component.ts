import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "map-app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

  // User name
  public userName: string = "";

  // Danh sách menu
  public menuItems: any[];

  constructor(public authService: AuthService) { }

  ngOnInit() {
    let userInfo = this.authService.getUser();
    this.userName = userInfo.given_name;
  }

  logOut() {
    this.authService.logout();
  }
}
