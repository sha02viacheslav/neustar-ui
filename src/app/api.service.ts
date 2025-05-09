import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Filter, NeustarTemplateUpload, NeustarTrackerMapping, Pagination } from '@models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  prodUrl = 'https://neustar-order-insights-api.ho-g2.cf.comcast.net';
  apiUrl = environment.production ? this.prodUrl : 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCount(filter: Filter): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(this.apiUrl + '/neustar/postgrescount', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getList(filter: Filter): Observable<ApiResponse<Pagination<NeustarTemplateUpload>>> {
    return this.http.get<ApiResponse<Pagination<NeustarTemplateUpload>>>(this.apiUrl + '/neustar/postgresdata', {
      withCredentials: true,
      params: { ...filter },
    });
  }

  getRecord(id: number): Observable<ApiResponse<NeustarTemplateUpload>> {
    return this.http.get<ApiResponse<NeustarTemplateUpload>>(this.apiUrl + `/neustar/${id}`, { withCredentials: true });
  }

  retryFallout(id: number): Observable<ApiResponse<NeustarTemplateUpload>> {
    return this.http.post<ApiResponse<NeustarTemplateUpload>>(
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
    return this.http.get<ApiResponse<Pagination<NeustarTrackerMapping>>>(this.apiUrl + '/tracker-mapping', {
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
    return this.http.delete<ApiResponse<NeustarTemplateUpload>>(
      this.apiUrl + `/tracker-mapping/${carrier}/${tracker}`,
      {
        withCredentials: true,
      },
    );
  }
}
