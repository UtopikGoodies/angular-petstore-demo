import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetTagsComponent } from './pet-tags.component';

describe('PetTagsComponent', () => {
  let component: PetTagsComponent;
  let fixture: ComponentFixture<PetTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetTagsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
