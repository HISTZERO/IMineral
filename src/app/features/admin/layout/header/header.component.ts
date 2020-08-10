import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<string>();

  // User name
  public userName: string = "";

  constructor(public authService: AuthService) { }

  ngOnInit() {
    let userInfo = this.authService.getUser();
    this.userName = userInfo.given_name;
  }

  logOut() {
    this.authService.logout();
  }

  sidebarToggle() {
    this.toggleSidebar.next();
  }
}
