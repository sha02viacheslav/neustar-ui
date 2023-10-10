import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { NeustarRoutingModule } from './neustar-routing.module';
import { NeustarComponent } from './neustar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FalloutComponent } from './fallout/fallout.component';
import { ChartComponent } from '../chart/chart.component';
import { DateFilterModule } from '../date-filter/date-filter.module';
import { DetailComponent } from './pages/detail/detail.component';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './pages/list/list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { BreakdownTableComponent } from './breakdown-table/breakdown-table.component';

// TODO: update with components

@NgModule({
  declarations: [
    NeustarComponent,
    ToolbarComponent,
    FalloutComponent,
    ChartComponent,
    DetailComponent,
    ListComponent,
    DashboardComponent,
    SearchResultComponent,
    BreakdownTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NeustarRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatGridListModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    DateFilterModule,
    SharedModule,
  ],
})
export class NeustarModule {}
