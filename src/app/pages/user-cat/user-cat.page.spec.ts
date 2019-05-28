import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCatPage } from './user-cat.page';

describe('UserCatPage', () => {
  let component: UserCatPage;
  let fixture: ComponentFixture<UserCatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
