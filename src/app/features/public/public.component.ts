import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  public containerClass: string = "navbar-top";

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(
  ) { }
}
