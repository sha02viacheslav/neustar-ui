import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerInputEvent,
  MatDateRangeSelectionStrategy,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';

@Injectable()
export class FiveDayRangeSelectionStrategy implements MatDateRangeSelectionStrategy<Date> {
  constructor(private _dateAdapter: DateAdapter<string>) {}

  selectionFinished(date: Date | null): DateRange<Date> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: Date | null): DateRange<Date> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: Date | null): DateRange<Date> {
    if (date) {
      const d = moment(date);
      const start = d.startOf('week').toDate();
      const end = d.endOf('week').toDate();
      return new DateRange<Date>(start, end);
    }

    return new DateRange<Date>(null, null);
  }
}

@Component({
  selector: 'app-week-selector',
  templateUrl: './week-selector.component.html',
  styleUrls: ['./week-selector.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class WeekSelectorComponent {
  @Output() weekChanged = new EventEmitter<Date>();
  constructor() {}

  handleSelect(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) this.weekChanged.emit(date);
  }
}
