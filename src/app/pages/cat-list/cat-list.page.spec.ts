import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatListPage } from './cat-list.page';

describe('CatListPage', () => {
  let component: CatListPage;
  let fixture: ComponentFixture<CatListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
