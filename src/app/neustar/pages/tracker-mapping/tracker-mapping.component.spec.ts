import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerMappingComponent } from './tracker-mapping.component';

describe('TrackerMappingComponent', () => {
  let component: TrackerMappingComponent;
  let fixture: ComponentFixture<TrackerMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerMappingComponent]
    });
    fixture = TestBed.createComponent(TrackerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
