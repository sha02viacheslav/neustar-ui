import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Filter, NeustarTemplateUpload, NeustarTrackerMapping, Pagination } from '@models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  prodUrl = 'http://neustar-order-insights-api.as-g8.cf.comcast.net/';
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

  createTrackerMapping(data: NeustarTrackerMapping): Observable<ApiResponse<NeustarTrackerMapping>> {
    return this.http.post<ApiResponse<NeustarTrackerMapping>>(this.apiUrl + `/tracker-mapping`, data, {
      withCredentials: true,
    });
  }

  getTrackerMappings(filter: Filter): Observable<ApiResponse<Pagination<NeustarTrackerMapping>>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/tracker-mapping', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getTrackerMapping(carrier: string, tracker: string): Observable<ApiResponse<NeustarTrackerMapping>> {
    return this.http.get<ApiResponse<NeustarTrackerMapping>>(this.apiUrl + `/tracker-mapping/${carrier}/${tracker}`, {
      withCredentials: true,
    });
  }

  updateTrackerMapping(
    carrier: string,
    tracker: string,
    data: NeustarTrackerMapping,
  ): Observable<ApiResponse<NeustarTrackerMapping>> {
    return this.http.post<ApiResponse<NeustarTrackerMapping>>(
      this.apiUrl + `/tracker-mapping/${carrier}/${tracker}`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  deleteTrackerMapping(carrier: string, tracker: string): Observable<ApiResponse<NeustarTemplateUpload>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/tracker-mapping/${carrier}/${tracker}`, {
      withCredentials: true,
    });
  }

  uploadTracker(carrier: string, tracker: string, data: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + `/tracker-upload/${carrier}/${tracker}`, data, {
      withCredentials: true,
    });
  }
}
