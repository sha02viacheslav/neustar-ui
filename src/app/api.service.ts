import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiResponse, Filter, NeustarTemplateUpload, Pagination } from '@models';
import { environment } from 'src/environments/environment';

// TODO: replace prodUrl

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  prodUrl = '';
  apiUrl = environment.production ? this.prodUrl : 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCount(filter: Filter): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/neustar/postgrescount', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getList(filter: Filter): Observable<ApiResponse<Pagination<NeustarTemplateUpload>>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/neustar/postgresdata', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getRecord(id: number): Observable<ApiResponse<NeustarTemplateUpload>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/neustar/${id}`, { withCredentials: true });
  }

  retryFallout(id: number): Observable<ApiResponse<NeustarTemplateUpload>> {
    return this.http.post<ApiResponse<any>>(
      this.apiUrl + `/neustar/retry-fallout/${id}`,
      {},
      { withCredentials: true },
    );
  }
}
