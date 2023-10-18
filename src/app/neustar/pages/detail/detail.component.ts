import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NeustarTemplateUpload } from '@models';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  table: NeustarTemplateUpload;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        const id = +(params.get('id') || 0);
        if (id) this.getRecord(id);
      }
    });
  }

  getRecord(id: number) {
    this.isLoading = true;
    this.apiService.getRecord(id).subscribe((res) => {
      this.isLoading = false;
      if (res.success) {
        this.table = res.result;
      }
    });
  }
}
