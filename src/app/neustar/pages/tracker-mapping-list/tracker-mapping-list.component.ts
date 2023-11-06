import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NeustarTrackerMapping } from '@models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { BlockUIService } from 'ng-block-ui';
import { catchError, debounceTime, merge, tap } from 'rxjs';

@Component({
  selector: 'app-tracker-mapping-list',
  templateUrl: './tracker-mapping-list.component.html',
  styleUrls: ['./tracker-mapping-list.component.scss'],
})
export class TrackerMappingListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['carrier_id', 'tracker', 'delete'];
  dataSource: MatTableDataSource<NeustarTrackerMapping>;
  totalCount: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private blockUIService: BlockUIService,
  ) {}

  ngOnInit() {
    this.getList();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.getList();
      });
  }

  private getList() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getTrackerMappings({
        pageIndex: this.paginator?.pageIndex || 1,
        pageSize: this.paginator?.pageSize || 10,
        sort: this.sort?.active || 'carrier_id',
        order: this.sort?.direction || 'desc',
      })
      .pipe(
        tap((res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }
          this.dataSource = new MatTableDataSource(res.result.data || []);
          this.totalCount = res.result.totalCount;
        }),
        catchError((err) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
          throw 'Error Details: ' + err;
        }),
      )
      .subscribe(console.log);
  }

  deleteTrackerMapping(trackerMapping: NeustarTrackerMapping) {
    this.blockUIService.start('APP', `Deleting Tracker Mapping...`);
    this.apiService.deleteTrackerMapping(trackerMapping.carrier_id, trackerMapping.tracker).subscribe(() => {
      this.getList();
      this.blockUIService.stop('APP');
    });
  }
}
