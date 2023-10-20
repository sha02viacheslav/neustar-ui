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
  allMappingMatched = false;
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
      this.blockUIService.start('APP', `Parsing...`);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        this.headers = [];
        for (const key in worksheet) {
          if (key.match(/^[A-Z]+1$/)) {
            const headerStr = convertExcelString(worksheet[key].v);
            this.headers.push({ label: headerStr, value: headerStr });
          }
        }

        event.target.value = '';

        const trackerMapping = this.trackerMappings[this.trackerMappingIndex];

        if (
          this.headers.every(
            (header) => Object.keys(trackerMapping).findIndex((key) => trackerMapping[key] === header.value) > -1,
          )
        ) {
          this.allMappingMatched = true;
        } else {
          this.toastr.info(
            'All field names are not matched in the mapping record. Please add tracker mapping with these field names.',
          );
          this.router.navigateByUrl('/tracker-mapping');
        }
        this.blockUIService.stop('APP');
      };

      reader.readAsArrayBuffer(file);
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
