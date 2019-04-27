import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempTabsPage } from './temp-tabs.page';

describe('TempTabsPage', () => {
  let component: TempTabsPage;
  let fixture: ComponentFixture<TempTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
