import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLinkComponent } from './security-link.component';

describe('SecurityLinkComponent', () => {
  let component: SecurityLinkComponent;
  let fixture: ComponentFixture<SecurityLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityLinkComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
