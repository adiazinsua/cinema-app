import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
// import { routes } from './app.routes';
import { CreateAccountPage } from './pages/create-account/create-account.page';
import { HomePage } from './pages/home/home.page';
// import { routes } from './app.routes';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'create-account',
    component: CreateAccountPage,
  },
  {
    path: '',
    component: HomePage,
  },
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full',
  // },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
];

// export const commonRoutes: Routes =
//   [
//     // {
//     //   path: 'news-detail/:id',
//     //   component: NewsDetailComponent,
//     //   canActivate: [ConnectedGuard]
//     // },

//   ]

// const routing: Routes = [
//   // {
//   //   path: '',
//   //   pathMatch: 'full',
//   //   redirectTo: routes.unauthHome(),
//   // },
//   {
//     path: routes.login(),
//     component: LoginPage,
//     // canActivate: [LoggedInGuard],
//   },
//   {
//     path: routes.createAccount(),
//     component: CreateAccountPage
//   },
//   // {
//   //   path: '',
//   //   component: DefaultLayoutComponent, // tabs
//   //   canActivate: [ AuthorizatedGuardFn ],
//   //   children: [
//   //     {
//   //       path: '',
//   //       pathMatch: 'full',
//   //       redirectTo: routes.home(),
//   //     },
//   //     {
//   //       path: routes.home(),
//   //       canActivate: [ConnectedGuard],
//   //       children: [
//   //         {
//   //           path: '',
//   //           component: HomeComponent
//   //         },
//   //         ...commonRoutes,
//   //       ]
//   //     },
//   //     {
//   //       path: routes.news(),
//   //       canActivate: [ConnectedGuard],
//   //       children: [
//   //         {
//   //           path: '',
//   //           component: NewsComponent
//   //         },
//   //         ...commonRoutes
//   //       ]
//   //     },
//   //     {
//   //       path: routes.locationTracker(),
//   //       component: LocationTrackerComponent,
//   //       canActivate: [ AuthorizatedGuardFn ],
//   //       pathMatch: 'full'
//   //     },
//   //   ],
//   // }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routing)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
