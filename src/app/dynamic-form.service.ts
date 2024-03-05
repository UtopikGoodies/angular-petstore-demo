import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Pet } from '@utopikgoodies/swagger-petstore-client';
import { AbstractFormField, DialogAction, DialogOutput, DynamicDialog, FormFieldArray, FormFieldInput, FormFieldSelect, FormfieldLabel, FormfieldObject, Option } from '../../lib/angular-components/projects/dynamic-form/src/public-api';

export enum Action {
  Create = 'Create',
  Update = 'Update',
}

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService
  ) { }

  generatePetForm(pet: Pet | undefined = undefined): Observable<AbstractFormField[]> {
    return new Observable<AbstractFormField[]>((observer) => {
      const action = pet ? Action.Update : Action.Create;

      const formFieldPhotoUrls: FormFieldInput<string>[] = [];
      if (pet?.photoUrls) {
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
      } else {
        formFieldPhotoUrls.push(
          new FormFieldInput<string>({
            name: 'photoUrl',
            title: 'Photo Url',
            required: true,
            value: '',
          }),
        );
      }

      const formFieldTags: AbstractFormField[] = [];
      if (pet?.tags) {
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
      } else {
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
                value: this.getRandomInt(1, 10000),
              }),
              new FormFieldInput<string | undefined>({
                name: 'name',
                title: 'Name',
                required: true,
                value: '',
              }),
            ],
          }),
        );
      }

      observer.next([
        new FormfieldLabel({
          name: 'id',
          title: 'Id',
          hidden: action == Action.Create,
          value: pet?.id || this.getRandomInt(1, 10000)
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
          formFields: formFieldPhotoUrls,
        }),
        new FormFieldArray({
          name: 'tags',
          title: 'Tags',
          distinct: true,
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
      ]);
      observer.complete();

      return () => { };
    });
  }

  openPetDialog(pet: Pet | undefined = undefined): Observable<Pet | undefined> {
    return new Observable<Pet>((observer) => {
      const action = pet ? Action.Update : Action.Create;

      this.generatePetForm(pet).subscribe({
        next: (formFields) => {
          const dialogRef = this.dialog.open(DynamicDialog, {
            disableClose: true,
            width: "90%",
            data: {
              title: action == Action.Update?"Update Pet":"Add a new Pet",
              buttonActionText: action,
              buttonDelete: action == Action.Update,
              dynFormFields: formFields,
            },
          });

          dialogRef.beforeClosed().subscribe({
            next: (dialogOutput: DialogOutput<Pet>) => {
              console.debug(dialogOutput);
              switch (dialogOutput.action) {
                case DialogAction.Close:
                  observer.complete();
                  break;

                case DialogAction.Submit:
                  switch (action) {
                    case Action.Create:
                      this.apiService.petService.addPet(dialogOutput.value)
                        .subscribe({
                          next: (value) => observer.next(value),
                          error: (error) => observer.error(error),
                          complete: () => {
                            observer.complete();
                          },
                        });
                      break;

                    case Action.Update:
                      this.apiService.petService.updatePet(dialogOutput.value)
                        .subscribe({
                          next: (value) => observer.next(value),
                          error: (error) => observer.error(error),
                          complete: () => {
                            observer.complete();
                          },
                        });
                      break;
                  }
                  break;

                case DialogAction.Delete:
                  this.apiService.petService.deletePet(dialogOutput.value.id as number)
                    .subscribe({
                      next: (value) => observer.next(value),
                      error: (error) => observer.error(error),
                      complete: () => {
                        observer.complete();
                      },
                    });
                  break;
              }
            },
            error: (error) => console.error(error),
            complete: () => console.log("Dynamic Form Access Control System dialog closed"),
          });
        }
      });

      return () => { };
    });
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
