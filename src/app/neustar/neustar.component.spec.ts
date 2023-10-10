import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeustarComponent } from './neustar.component';

describe('TemplateComponent', () => {
  let component: NeustarComponent;
  let fixture: ComponentFixture<NeustarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeustarComponent],
    });
    fixture = TestBed.createComponent(NeustarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
