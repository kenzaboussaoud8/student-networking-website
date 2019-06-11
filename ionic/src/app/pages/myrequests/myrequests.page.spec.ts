import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrequestsPage } from './myrequests.page';

describe('MyrequestsPage', () => {
  let component: MyrequestsPage;
  let fixture: ComponentFixture<MyrequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyrequestsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyrequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
