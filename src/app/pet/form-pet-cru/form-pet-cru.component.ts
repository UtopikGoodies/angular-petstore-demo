import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractFormField,
  DynFormModule,
  DynamicFormfieldLabel,
  FormFieldArray,
  FormFieldInput,
  FormFieldSelect,
  Option,
  FormfieldLabel,
  FormfieldObject,
} from '../../../../lib/angular-components/projects/dynamic-form/src/lib';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../api.service';
import { Pet } from '@utopikgoodies/swagger-petstore-client';
import { Router } from '@angular/router';

export enum Action {
  Create = 'Create',
  Update = 'Update',
}

@Component({
  selector: 'app-form-pet-cru',
  standalone: true,
  imports: [DynFormModule, MatButtonModule],
  templateUrl: './form-pet-cru.component.html',
  styleUrl: './form-pet-cru.component.scss',
})
export class FormPetCruComponent implements OnInit {
  @Input() formTitle!: string;
  @Input() action: Action = Action.Create;
  @Input() petId!: number;

  pet!: Pet;
  formFields!: AbstractFormField[];
  ActionType = Action;
  notFound = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {
    // this.formFields = this.generateFormField(this.pet);
  }

  ngOnInit(): void {
    if (this.petId) {
      this.apiService.petService.getPetById(this.petId).subscribe({
        next: (value) => {
          this.pet = value;
          this.formFields = this.generateFormField(this.pet);
        },
        error: (err) => {
          console.error(err);
          if (err['status'] == 404) {
            this.notFound = true;
          }
        },
      });
    } else {
      this.formFields = this.generateFormField(this.pet);
    }
  }

  generateFormField(pet: Pet | undefined): AbstractFormField[] {
    let formFieldPhotoUrls: FormFieldInput<string>[] = [];
    pet?.photoUrls.forEach((photoUrl) => {
      formFieldPhotoUrls.push(
        new FormFieldInput<string>({
          name: 'photoUrl',
          title: 'Photo Url',
          required: true,
          value: photoUrl,
        }),
      );
    });

    let formFieldTags: AbstractFormField[] = [];
    pet?.tags?.forEach((tag) => {
      formFieldTags.push(
        new FormfieldObject({
          name: 'tag',
          title: 'Tag',
          formFields: [
            new FormFieldInput<number | undefined>({
              name: 'id',
              title: 'id',
              required: true,
              hidden: true,
              value: tag.id,
            }),
            new FormFieldInput<string | undefined>({
              name: 'name',
              title: 'Name',
              required: true,
              value: tag.name,
            }),
          ],
        }),
      );
    });

    return [
      new FormfieldLabel({
        name: 'id',
        title: 'Id',
        value: pet?.id?.toString() as string,
      }),
      new FormFieldInput<number>({
        name: 'id',
        title: 'id',
        required: true,
        hidden: true,
        value: pet?.id || this.getRandomInt(1, 10000),
      }),
      new FormFieldInput<string>({
        name: 'name',
        title: 'Name',
        required: true,
        value: pet?.name || '',
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
            value: pet?.category?.id || this.getRandomInt(1, 10000),
          }),
          new FormFieldInput<string>({
            name: 'name',
            title: 'Name',
            required: true,
            value: pet?.category?.name || '',
          }),
        ],
      }),
      new FormFieldArray({
        name: 'photoUrls',
        title: 'Photo Urls',
        distinct: true,
        formFieldModel: new FormFieldInput<string>({
          name: 'photoUrl',
          title: 'Photo Url',
          required: true,
          value: '',
        }),
        formFields: formFieldPhotoUrls,
      }),
      new FormFieldArray({
        name: 'tags',
        title: 'Tags',
        distinct: true,
        formFieldModel: new FormfieldObject({
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
        formFields: formFieldTags,
      }),
      new FormFieldSelect<Pet.StatusEnum>({
        name: 'status',
        title: 'Status',
        required: true,
        options: [
          { value: Pet.StatusEnum.Available, viewValue: 'Available' },
          { value: Pet.StatusEnum.Pending, viewValue: 'Pending' },
          { value: Pet.StatusEnum.Sold, viewValue: 'Sold' },
        ] as Option<Pet.StatusEnum>[],
        value: pet?.status || undefined,
      }),
    ];
  }

  isAction(action: Action) {
    return this.action == action;
  }

  onDelete() {
    this.apiService.petService.deletePet(this.petId).subscribe({
      next: (value) => {
        // console.debug(value);
      },
      error: (err) => console.error(err),
      complete: () => {
        this.router.navigate(['/']); //TODO:FIX: Do nothing
      },
    });
  }

  onSubmit(value: object) {
    switch (this.action) {
      case Action.Create:
        this.apiService.petService.addPet(value as Pet).subscribe({
          next: (value) => {
            // console.debug(value);
            this.router.navigate(['/', 'pet', value.id]);
          },
          error: (err) => console.error(err),
        });
        break;

      case Action.Update:
        this.apiService.petService.updatePet(value as Pet).subscribe({
          next: (value) => {
            // console.debug(value);
            this.router.navigate(['/', 'pet', value.id]);
          },
          error: (err) => console.error(err),
        });
        break;
    }
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
