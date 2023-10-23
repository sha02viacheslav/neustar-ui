import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { NeustarTemplateUpload } from '@models';
import { debounceTime, merge } from 'rxjs';
import { sanitizeData } from 'src/app/@core/utils';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BlockUIService } from 'ng-block-ui';

// TODO: update rawWhere
// update ngOnInit()

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListComponent {
  // import enum: readonly SummaryType = SummaryType;
  // summaryType: SummaryType;
  displayedColumns: string[] = [
    // TODO: update displayedColumns
  ];
  columnsToDisplayWithExpand: string[] = ['expand', ...this.displayedColumns];
  expandedElement: NeustarTemplateUpload | null;
  dataSource: MatTableDataSource<NeustarTemplateUpload>;
  totalCnt: number;
  dateFilter: { start: string; end: string };
  // typeOptions: { value: SummaryType; label: string }[] = [];
  typeOptions = [];
  search = '';

  titles: { [key: string]: string } = {
    // TODO: add titles based on enum
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private blockUIService: BlockUIService,
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   if (params.has('summaryType')) {
    //     const summaryType = params.get('summaryType');
    //     if (summaryType) {
    //       this.summaryType = summaryType as SummaryType;
    //       this.getList();
    //       // TODO: Add enum switchcase
    //       }
    //     }
    //   }
    // });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.getList();
      });
  }

  handleChangeDateFilter(value: { start: string; end: string }) {
    this.dateFilter = value;
    this.getList();
  }

  handleChangeType(event: MatButtonToggleChange) {
    this.getList();
  }

  private getList() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getList({
        search: this.search || '',
        pageIndex: this.paginator?.pageIndex || 1,
        pageSize: this.paginator?.pageSize || 10,
        sort: this.sort?.active || 'end_time',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        // rawWhere: getSummaryQuery(this.summaryType),
      })
      .subscribe(
        (res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }
          this.dataSource = new MatTableDataSource(res.result.data || []);
          this.totalCnt = res.result.totalCount;
        },
        (err: HttpErrorResponse) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }

  exportXls() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getList({
        search: this.search || '',
        sort: this.sort?.active || 'end_time',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        // rawWhere: getSummaryQuery(this.summaryType),
      })
      .subscribe(
        (res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }

          if (!res.result.data?.length) {
            this.toastr.error('No data to export');
            return;
          }

          const dataToExport = res.result.data.map((rawData) => {
            // TODO: add fields to export
            return {
              'Data Export Template': rawData,
            };
          });

          const sanitizedData = sanitizeData(dataToExport);

          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(sanitizedData);
          XLSX.utils.book_append_sheet(wb, ws, 'Blank');
          XLSX.writeFile(wb, `${this.titles[0]}.xlsx`); // TODO: update titles
        },
        (err: HttpErrorResponse) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }

  handleChangeSearch(value: string) {
    this.search = value;
    this.getList();
  }
}
