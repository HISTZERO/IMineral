import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {

  public containerClass: string = "navbar-top";

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }
}
