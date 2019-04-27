import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempTab2Page } from './temp-tab2.page';

describe('TempTab2Page', () => {
  let component: TempTab2Page;
  let fixture: ComponentFixture<TempTab2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempTab2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempTab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
