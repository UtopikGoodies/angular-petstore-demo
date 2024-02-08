import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractFormField,
  DynFormModule,
  FormFieldArray,
  FormFieldInput,
  FormFieldSelect,
  FormfieldObject,
} from '../../../../lib/angular-components/projects/dynamic-form/src/lib';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../api.service';
import { Pet } from '@utopikgoodies/swagger-petstore-client';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-form-pet-cru',
  standalone: true,
  imports: [DynFormModule, MatButtonModule],
  templateUrl: './form-pet-cru.component.html',
  styleUrl: './form-pet-cru.component.scss',
})
export class FormPetCruComponent implements OnInit {
  @Input() formTitle!: string;
  @Input() petId!: number;

  pet!: Pet;
  formFields!: AbstractFormField[];

  formFieldsEmpty: AbstractFormField[] = [
    new FormFieldInput<number>({
      name: 'id',
      title: 'id',
      required: true,
      hidden: true,
      value: this.getRandomInt(1, 10000),
    }),
    new FormFieldInput<string>({
      name: 'name',
      title: 'Name',
      required: true,
      value: '',
    }),
    new FormfieldObject({
      name: 'category',
      title: 'Category',
      formFields: [
        new FormFieldInput<number>({
          name: 'id',
          title: 'id',
          required: true,
          hidden: true,
          value: this.getRandomInt(1, 10000),
        }),
        new FormFieldInput<string>({
          name: 'name',
          title: 'Name',
          required: true,
          value: '',
        }),
      ],
    }),
    new FormFieldArray({
      name: 'photoUrls',
      title: 'Photo Urls',
      uniqueValue: true,
      formField: new FormFieldInput<string>({
        name: 'photoUrl',
        title: 'Photo Url',
        required: true,
        value: '',
      }),
    }),
    new FormFieldArray({
      name: 'tags',
      title: 'Tags',
      uniqueValue: true,
      formField: new FormfieldObject({
        name: 'tag',
        title: 'Tag',
        formFields: [
          new FormFieldInput<number>({
            name: 'id',
            title: 'id',
            required: true,
            hidden: true,
            value: this.getRandomInt(1, 10000),
          }),
          new FormFieldInput<string>({
            name: 'name',
            title: 'Name',
            required: true,
            value: '',
          }),
        ],
      }),
    }),
    new FormFieldSelect<string>({
      name: 'status',
      title: 'Status',
      required: true,
      options: [
        { value: 'available', viewValue: 'Available' },
        { value: 'pending', viewValue: 'Pending' },
        { value: 'sold', viewValue: 'Sold' },
      ],
    }),
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (this.petId) {
      this.formFields = this.formFieldsEmpty;
      this.apiService.petService.getPetById(this.petId).subscribe({
        next: (value) => {
          this.pet = value;
        },
        error: (err) => console.error(err),
      });
    } else {
      this.formFields = this.formFieldsEmpty;
    }
  }

  setformFields(pet: Pet): AbstractFormField[] {
    let photoUrls


    let formFields: AbstractFormField[] = [
      new FormFieldInput<number | undefined>({
        name: 'id',
        title: 'id',
        required: true,
        value: pet.id,
      }),
      new FormFieldInput<string>({
        name: 'name',
        title: 'Name',
        required: true,
        value: pet.name,
      }),
      new FormfieldObject({
        name: 'category',
        title: 'Category',
        formFields: [
          new FormFieldInput<number | undefined>({
            name: 'id',
            title: 'id',
            required: true,
            hidden: true,
            value: pet.category?.id,
          }),
          new FormFieldInput<string | undefined>({
            name: 'name',
            title: 'Name',
            required: true,
            value: pet.category?.name,
          }),
        ],
      }),
      new FormFieldArray({ //TODO: Should be a list
        name: 'photoUrls',
        title: 'Photo Urls',
        uniqueValue: true,
        formField: new FormFieldInput<string>({
          name: 'photoUrl',
          title: 'Photo Url',
          required: true,
          value: '',
        }),
      }),
    ];

    return formFields;
  }

  onSubmit(value: object) {
    this.apiService.petService.addPet(value as Pet).subscribe({
      next: (value) => console.log(value),
      error: (err) => console.error(err),
    });
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
