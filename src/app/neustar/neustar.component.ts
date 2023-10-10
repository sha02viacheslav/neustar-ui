import { Component } from '@angular/core';
import { SearchService } from '../@core/services';

@Component({
  selector: 'app-neustar',
  templateUrl: './neustar.component.html',
  styleUrls: ['./neustar.component.scss'],
})
export class NeustarComponent {
  constructor(public searchService: SearchService) {}
}
