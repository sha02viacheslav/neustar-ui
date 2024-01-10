import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-breakdown-table',
  templateUrl: './breakdown-table.component.html',
  styleUrls: ['./breakdown-table.component.scss'],
})
export class BreakdownTableComponent {
  @Input() title: string;
  @Input() dateHeader: string;
  @Input() dateFormat: string;
  @Input() data: MatTableDataSource<{ date: string }> = new MatTableDataSource([]);
  displayedColumns: string[] = [''];
}
