import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { NeustarTemplateUpload } from '@models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, debounceTime, merge, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { sanitizeData } from '../../@core/utils';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
import { ToastrService } from 'ngx-toastr';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BlockUIService } from 'ng-block-ui';
import { DateFilterComponent } from '../../date-filter/date-filter.component';
import { DateRangeType } from '@enums';

// TODO: add unsubscribe Subject and takeUntil for all subscribers

@Component({
  selector: 'app-fallout',
  templateUrl: './fallout.component.html',
  styleUrls: ['./fallout.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FalloutComponent implements OnInit, AfterViewInit {
  private readonly FALLOUT_RAW_WHERE = "bot_execution_status != 'Completed'";
  displayedColumns: string[] = [
    'end_time',
    'carrierid',
    'tracker_file_path',
    'bot_execution_status',
    'exception',
    'invalid_pon_count',
    'retry',
  ];
  columnsToDisplayWithExpand: string[] = ['expand', ...this.displayedColumns];
  expandedElement: NeustarTemplateUpload | null;
  dataSource: MatTableDataSource<NeustarTemplateUpload>;
  totalCount: number;
  dateFilter: { start: string; end: string };
  dateRangeOptions = [
    { label: 'This Week', value: DateRangeType.THIS_WEEK },
    { label: 'This Month', value: DateRangeType.THIS_MONTH },
    { label: 'This Year', value: DateRangeType.THIS_YEAR },
  ];
  dateRange: DateRangeType;

  chartData: ChartData;
  chartType: ChartType = 'bar';
  chartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  total: number;
  search = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('dateFilter') dateFilterComponent: DateFilterComponent;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private blockUIService: BlockUIService,
  ) {}

  ngOnInit() {
    this.getList();
    this.loadData();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.getList();
      });
  }

  private async loadData() {
    this.blockUIService.start('APP', `Loading...`);
    const promises = []; // TODO: add all promises
    promises.push(
      new Promise((resolve) => {
        this.apiService
          .getCount({ rawWhere: '', ...this.dateFilter }) // TODO: update rawWhere
          .subscribe((res) => {
            this.total = Number(res.result); // TODO: Update total type
            resolve(res.result);
          });
      }),
    );

    Promise.all(promises).then(() => {
      this.loadChart();
      this.blockUIService.stop('APP');
    });
  }

  private loadChart(): void {
    // TODO: Update chartData
    this.chartData = {
      labels: ['Total', 'Total2'],
      datasets: [
        {
          label: 'Total',
          backgroundColor: ['#112F64', '#0D62FF', '#8BE1FA'],
          data: [this.total, this.total],
        },
      ],
    };
  }

  private getList() {
    console.log('GET List');
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getList({
        search: this.search || '',
        pageIndex: this.paginator?.pageIndex || 1,
        pageSize: this.paginator?.pageSize || 10,
        sort: this.sort?.active || 'start_time',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        rawWhere: this.FALLOUT_RAW_WHERE,
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

  handleChangeDateRange() {
    this.dateFilterComponent.clear();
    switch (this.dateRange) {
      case DateRangeType.THIS_WEEK: {
        this.dateFilter = { start: moment().startOf('week').format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') };
        break;
      }
      case DateRangeType.THIS_MONTH: {
        this.dateFilter = { start: moment().startOf('month').format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') };
        break;
      }
      case DateRangeType.THIS_YEAR: {
        this.dateFilter = { start: moment().startOf('year').format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') };
        break;
      }
    }
    this.getList();
    this.loadData();
  }

  handleChangeDateFilter(value: { start: string; end: string }) {
    this.dateFilter = value;
    this.dateRange = null;
    this.getList();
    this.loadData();
  }

  handleChangeSearch(value: string) {
    this.search = value;
    this.getList();
  }

  retryFallout(id: number) {
    this.blockUIService.start('APP', `Retrying Fallout...`);
    this.apiService.retryFallout(id).subscribe(() => {
      this.blockUIService.stop('APP');
    });
  }

  exportXls() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getList({
        search: this.search || '',
        sort: this.sort?.active || 'start_time',
        order: this.sort?.direction || 'desc',
        ...this.dateFilter,
        rawWhere: this.FALLOUT_RAW_WHERE,
      })
      .pipe(
        tap((res) => {
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
            return {
              'Carrier ID': rawData.carrierid,
              Tracker: rawData.tracker_file_path?.split('\\')?.pop() || 'N/A',
              'Automation Status': rawData.bot_execution_status,
              Exception: rawData.exception,
              'Exception Logs': rawData.exception_logs,
              Start: moment(rawData.start_time)?.format('MM/DD/YYYY'),
              End: moment(rawData.end_time)?.format('MM/DD/YYYY'),
              'Execution Time': rawData.execution_time,
              'Upload Status': rawData.template_upload_status,
              'Total Count': rawData.total_count,
              Successes: rawData.success_count,
              Errors: rawData.error_count,
              'Validation Count': rawData.validation_count,
              'Validation Result': rawData.validation_result,
              'Invalid PON Count': rawData.invalid_pon_count,
            };
          });

          const sanitizedData = sanitizeData(dataToExport);

          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(sanitizedData);
          XLSX.utils.book_append_sheet(wb, ws, 'Blank');
          XLSX.writeFile(wb, `Neustar_Order_Insights_Fallout.xlsx`);
        }),
        catchError((err) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
          console.log(err);
          throw 'Error Details: ' + err;
        }),
      )
      .subscribe(console.log);
  }
}
