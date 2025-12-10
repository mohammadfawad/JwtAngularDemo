import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JwtLogin } from './jwt-login';

describe('JwtLogin', () => {
  let component: JwtLogin;
  let fixture: ComponentFixture<JwtLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JwtLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
