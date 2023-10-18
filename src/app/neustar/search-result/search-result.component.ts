import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NeustarTemplateUpload } from '@models';
import { debounceTime, merge } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { SearchService } from '../../@core/services';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  isLoading = false;
  // TODO: Update displayedColumns
  displayedColumns: string[] = [];
  columnsToDisplayWithExpand: string[] = ['expand', ...this.displayedColumns];
  expandedElement: NeustarTemplateUpload | null;
  dataSource: MatTableDataSource<NeustarTemplateUpload>;
  totalCnt: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.searchService.searchInput$.pipe(debounceTime(600)).subscribe(() => {
      if (this.searchService.showSearchResult) {
        this.getList();
      }
    });
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
    this.isLoading = true;
    this.apiService
      .getList({
        search: this.searchService.search || '',
        pageIndex: this.paginator?.pageIndex || 1,
        pageSize: this.paginator?.pageSize || 10,
        sort: this.sort?.active || 'start_time',
        order: this.sort?.direction || 'desc',
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }
          this.dataSource = new MatTableDataSource(res.result.data || []);
          this.totalCnt = res.result.totalCount;
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }
}
