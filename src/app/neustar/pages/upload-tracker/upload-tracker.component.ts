import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ApiService } from '../../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { BlockUIService } from 'ng-block-ui';
import { NeustarTrackerMapping } from '@models';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { convertExcelString } from '../../../@core/utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-tracker',
  templateUrl: './upload-tracker.component.html',
  styleUrls: ['./upload-tracker.component.scss'],
})
export class UploadTrackerComponent implements OnInit {
  trackerMappings: NeustarTrackerMapping[];
  trackerMappingIndex: number;
  trackerFile: File;
  headers: { label: string; value: string }[];
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private blockUIService: BlockUIService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getList();
  }

  private getList() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService
      .getTrackerMappings({
        sort: 'carrier',
        order: 'desc',
      })
      .pipe(
        tap((res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }
          this.trackerMappings = (res.result.data || []).map((item, index) => {
            item.index = index;
            return item;
          });
        }),
        catchError((err) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
          throw 'Error Details: ' + err;
        }),
      )
      .subscribe(console.log);
  }

  handleClickBrowseFile() {
    if (this.trackerMappingIndex === undefined) {
      this.toastr.error('Please select tracker mapping first.');
      return;
    }

    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.trackerFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        event.target.value = '';

        const trackerMapping = this.trackerMappings[this.trackerMappingIndex];
        const sheetName = trackerMapping.sheet;

        if (!sheetName) {
          this.toastr.error(`The tracker mapping does not include a selected sheet.`);
          return;
        }

        setTimeout(() => {
          this.blockUIService.stop('APP');
        }, 2000);

        if (!workbook.SheetNames.includes(sheetName)) {
          this.toastr.error(
            `The uploaded tracker file does not include the sheet(${sheetName}) that was chosen in the tracker mapping.`,
          );
          return;
        }

        const worksheet = workbook.Sheets[sheetName];

        this.headers = [];
        for (const key in worksheet) {
          if (key.match(new RegExp('^[A-Z]+' + (trackerMapping.header_row || 1) + '$'))) {
            const headerStr = convertExcelString(worksheet[key].v);
            this.headers.push({ label: headerStr, value: headerStr });
          }
        }

        event.target.value = '';

        const mappingAllHeaders = JSON.parse(trackerMapping.all_headers);

        this.blockUIService.stop('APP');

        if (
          mappingAllHeaders.every(
            (header) => !header.value || this.headers.findIndex((x) => x.value === header.value) > -1,
          )
        ) {
          this.uploadTracker();
        } else {
          this.toastr.info(
            'All field names are not matched in the mapping record. Please add tracker mapping with these field names.',
          );
          this.router.navigateByUrl('/tracker-mapping');
        }
      };

      this.blockUIService.start('APP', `Parsing...`);
      setTimeout(() => {
        reader.readAsArrayBuffer(file);
      }, 300);
    }
  }

  uploadTracker() {
    this.blockUIService.start('APP', 'Uploading...');

    const formData = new FormData();
    formData.append('file', this.trackerFile);

    this.apiService
      .uploadTracker(
        this.trackerMappings[this.trackerMappingIndex].carrier,
        this.trackerMappings[this.trackerMappingIndex].tracker,
        formData,
      )
      .subscribe(
        (res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.snackBar.open(res.message?.[0] || '', 'Dismiss', { duration: 4000 });
            return;
          }

          this.toastr.success('Tracker has been uploaded successfully.');

          if (res.result) {
            console.log(res.result);
          }
        },
        (err: HttpErrorResponse) => {
          this.blockUIService.stop('APP');
          this.snackBar.open(err.message || '', 'Dismiss', { duration: 4000 });
        },
      );
  }
}
