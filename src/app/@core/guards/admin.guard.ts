import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { IUser } from '../data/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable((sub) => {
      this.loginService.validateSession().subscribe(
        (res: { status: string; user: IUser }) => {
          if (res.status === 'authenticated') {
            if (res.user && res.user.roles.includes('Admin')) {
              sub.next(true);
            } else {
              this.router.navigateByUrl('/report');
            }
          } else {
            this.router.navigateByUrl('/login');
            sub.next(false);
          }
        },
        (error) => {
          console.log(error);
          this.router.navigateByUrl('/login');
          sub.next(false);
        },
      );
    });
  }
}
