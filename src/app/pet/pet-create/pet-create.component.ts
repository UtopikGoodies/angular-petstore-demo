import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormPetCruComponent } from '../form-pet-cru/form-pet-cru.component';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [FormPetCruComponent],
  templateUrl: './pet-create.component.html',
  styleUrl: './pet-create.component.scss',
})
export class PetCreateComponent {
  pageTitle = 'Add a new pet';

  formFieldValue!: unknown;
  // isButtonActionDisabled = true;
  // isFormDisabled = false;


  // receiveFormFieldValue(value: unknown) {
  //   this.formFieldValue = value;
  // }

  // create() {
  //   this.isFormDisabled = true;
  // }
}
