import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTextInputComponent } from './edit-text-input.component';

describe('EditTextInputComponent', () => {
  let component: EditTextInputComponent;
  let fixture: ComponentFixture<EditTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTextInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTextInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
