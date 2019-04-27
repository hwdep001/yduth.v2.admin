import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements OnInit {

  @Input() menus: MenuInterface;

  constructor() { }

  ngOnInit() {}

}
