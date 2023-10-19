import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerMappingListComponent } from './tracker-mapping-list.component';

describe('TrackerMappingListComponent', () => {
  let component: TrackerMappingListComponent;
  let fixture: ComponentFixture<TrackerMappingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerMappingListComponent]
    });
    fixture = TestBed.createComponent(TrackerMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
