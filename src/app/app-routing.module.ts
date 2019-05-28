import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { environment } from 'src/environments/environment';

const p = environment.pageInfo;

const routes: Routes = [
  {
    path: p.root.path,
    redirectTo: p.home.path,
    pathMatch: 'full'
  },
  {
    path: p.signIn.path,
    loadChildren: './pages/sign-in/sign-in.module#SignInPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.home.path,
    loadChildren: './pages/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.userMng.path,
    loadChildren: './pages/user-mng/user-mng.module#UserMngPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.userInfo.path,
    loadChildren: './pages/user-info/user-info.module#UserInfoPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.userCat.path,
    loadChildren: './pages/user-cat/user-cat.module#UserCatPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.subRule.path,
    loadChildren: './pages/sub-rule/sub-rule.module#SubRulePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.profile.path,
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.photo.path,
    loadChildren: './pages/photo/photo.module#PhotoPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.temp.path,
    loadChildren: './pages/temp-tabs/temp-tabs.module#TempTabsPageModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
