import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { AuthGuard } from './../../guards/auth.guard';
import { TempTabsPage } from './temp-tabs.page';

const p = environment.pageInfo;

const routes: Routes = [
  {
    path: '',
    redirectTo: p.temp.tabs.path,
    pathMatch: 'full'
  },
  {
    path: p.temp.tabs.path,
    component: TempTabsPage,
    children: [
      {
        path: '',
        redirectTo: p.temp.tab1.path,
        pathMatch: 'full'
      },
      {
        path: p.temp.tab1.path,
        loadChildren: './temp-tab1/temp-tab1.module#TempTab1PageModule',
        canActivate: [AuthGuard]
      },
      {
        path: p.temp.tab2.path,
        loadChildren: './temp-tab2/temp-tab2.module#TempTab2PageModule',
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TempTabsPage]
})
export class TempTabsPageModule {}
