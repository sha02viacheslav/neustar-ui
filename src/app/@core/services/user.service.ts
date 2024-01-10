import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserData } from '../data/abstracts/user-data.abstract';
import { HttpClient } from '@angular/common/http';
import { ServerDetails } from '../config.core';
import { IUser } from '../data/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService extends UserData {
  user: IUser;
  usersSubject: Subject<IUser> = new Subject();
  roleSubject: Subject<IUser> = new Subject();
  apiVersion: string;

  constructor(private http: HttpClient) {
    super();
    this.apiVersion = 'v1';
  }

  getUser(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${ServerDetails.baseUrl}/auth/session`, { withCredentials: true });
  }

  getUsers() {
    this.http.get(`${ServerDetails.baseUrl}/users`, { withCredentials: true }).subscribe((users: { data: IUser }) => {
      this.usersSubject.next(users.data);
    });
  }

  getUsersByRole(role: string) {
    this.http
      .get(`${ServerDetails.baseUrl}/users?role=${role}`, { withCredentials: true })
      .subscribe((users: { data: IUser }) => {
        this.roleSubject.next(users.data);
      });
  }

  addUser(form: IUser): Observable<IUser> {
    const { ntid, email, name, title, role, groups, emailAlerts } = form;
    const createData = {
      ntid,
      email,
      name,
      title,
      role,
      groups,
      emailAlerts,
    };
    return this.http.post<IUser>(`${ServerDetails.baseUrl}/users`, createData, { withCredentials: true });
  }

  updateUser(form: IUser): Observable<IUser> {
    const { ntid, email, name, title, role, groups, emailAlerts } = form;
    const updateData = {
      ntid,
      email,
      name,
      title,
      role,
      groups,
      emailAlerts,
    };
    return this.http.put<IUser>(`${ServerDetails.baseUrl}/users`, updateData, { withCredentials: true });
  }

  deleteUser(ntid: string): Observable<IUser> {
    return this.http.delete<IUser>(`${ServerDetails.baseUrl}/users?ntid=${ntid}`, { withCredentials: true });
  }
}
