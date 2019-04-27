import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempTab1Page } from './temp-tab1.page';

describe('TempTab1Page', () => {
  let component: TempTab1Page;
  let fixture: ComponentFixture<TempTab1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempTab1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempTab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
