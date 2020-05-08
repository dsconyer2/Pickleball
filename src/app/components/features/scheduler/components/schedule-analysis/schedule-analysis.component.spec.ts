import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAnalysisComponent } from './schedule-analysis.component';

describe('ScheduleAnalysisComponent', () => {
  let component: ScheduleAnalysisComponent;
  let fixture: ComponentFixture<ScheduleAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleAnalysisComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
