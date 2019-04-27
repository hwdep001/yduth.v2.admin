import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { User } from './../../models/User';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent implements OnInit {

  @Input() user: User;

  public pageInfo;

  constructor(
    public router: Router,
    public menuCtrl: MenuController
  ) {
    this.pageInfo = environment.pageInfo;
  }

  ngOnInit() {}

  closeMenu() {
    this.menuCtrl.close();
  }

}
