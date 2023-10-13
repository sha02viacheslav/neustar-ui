import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // TODO: update tabs
  tabs = [
    { link: '/summary', label: 'Summary' },
    { link: '/fallout', label: 'Fallout' },
  ];
  activeLink: string;

  constructor(private location: Location) {
    const activeLinkIndex = this.tabs.findIndex((item) => this.location.path().includes(item.link));
    this.activeLink = this.tabs[activeLinkIndex || 0].link;
  }
}
