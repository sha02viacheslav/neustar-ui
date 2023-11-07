import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalMappingComponent } from './additional-mapping.component';

describe('AdditionalMappingComponent', () => {
  let component: AdditionalMappingComponent;
  let fixture: ComponentFixture<AdditionalMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalMappingComponent]
    });
    fixture = TestBed.createComponent(AdditionalMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
