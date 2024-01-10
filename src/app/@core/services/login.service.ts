import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ServerDetails } from '../config.core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoginService implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private apiVersion = 'v1';

  // TODO: take out document?
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ssoAuth(code: string) {
    return this.http.get(`${ServerDetails.baseUrl}/auth/sso?code=${code}`, { withCredentials: true });
  }

  validateSession() {
    return this.http.get(`${ServerDetails.baseUrl}/auth/session`, ServerDetails.routerConfig);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
