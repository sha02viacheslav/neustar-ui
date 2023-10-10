import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeustarComponent } from './neustar.component';
import { AuthGuard } from '../@core/guards/auth.guard';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FalloutComponent } from './fallout/fallout.component';

// TODO: update routes

const routes: Routes = [
  {
    path: '',
    component: NeustarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        children: [
          {
            path: 'fallout',
            component: FalloutComponent,
          },
          {
            path: '',
            redirectTo: '/fallout',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'list/:summaryType',
        component: ListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        component: DetailComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeustarRoutingModule {}
