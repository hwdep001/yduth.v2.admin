import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMngPage } from './user-mng.page';

describe('UserMngPage', () => {
  let component: UserMngPage;
  let fixture: ComponentFixture<UserMngPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMngPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMngPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
