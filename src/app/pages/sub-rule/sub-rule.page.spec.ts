import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRulePage } from './sub-rule.page';

describe('SubRulePage', () => {
  let component: SubRulePage;
  let fixture: ComponentFixture<SubRulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubRulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
