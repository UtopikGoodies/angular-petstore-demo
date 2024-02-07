import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import {
  AbstractFormField,
  DynamicFormComponent,
  DynamicFormContentComponent,
  FormFieldArray,
  FormFieldInput,
  FormFieldSelect,
  FormfieldObject,
} from '../../../../lib/angular-components/projects/dynamic-form/src/lib/public-api';

@Component({
  selector: 'app-form-pet-cru',
  standalone: true,
  imports: [DynamicFormComponent, DynamicFormContentComponent],
  templateUrl: './form-pet-cru.component.html',
  styleUrl: './form-pet-cru.component.scss',
})
export class FormPetCruComponent {
  @Input() formTitle!: string;
  @Input() isFormDisabled!: boolean;
  @Output() statusChanges = new EventEmitter<FormControlStatus>();
  @Output() valueChanges = new EventEmitter<object>();

  formFields: AbstractFormField[] = [
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

  receivedStatusChanges(status: FormControlStatus) {
    this.statusChanges.emit(status);
  }

  receivedValueChanges(value: object) {
    this.valueChanges.emit(value);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
