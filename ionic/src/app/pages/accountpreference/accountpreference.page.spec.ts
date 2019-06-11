import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountpreferencePage } from './accountpreference.page';

describe('AccountpreferencePage', () => {
  let component: AccountpreferencePage;
  let fixture: ComponentFixture<AccountpreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountpreferencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountpreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
