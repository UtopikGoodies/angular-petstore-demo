import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetReadComponent } from './pet-read.component';

describe('PetReadComponent', () => {
  let component: PetReadComponent;
  let fixture: ComponentFixture<PetReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetReadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
