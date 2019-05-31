import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLostPage } from './password-lost.page';

describe('PasswordLostPage', () => {
  let component: PasswordLostPage;
  let fixture: ComponentFixture<PasswordLostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordLostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordLostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
