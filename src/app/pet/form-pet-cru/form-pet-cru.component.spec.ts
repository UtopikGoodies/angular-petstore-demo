import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPetCruComponent } from './form-pet-cru.component';

describe('FormPetCreateComponent', () => {
  let component: FormPetCruComponent;
  let fixture: ComponentFixture<FormPetCruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPetCruComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPetCruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
