import { Routes } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { PetComponent } from './pet/pet.component';
import { StoreInventoryComponent } from './store/store-inventory/store-inventory.component';
import { PetStatusComponent } from './pet/pet-status/pet-status.component';
import { PetTagsComponent } from './pet/pet-tags/pet-tags.component';
import { PetCreateComponent } from './pet/pet-create/pet-create.component';

export const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    pathMatch: 'full',
  },
  {
    path: 'store',
    component: StoreComponent,
    children: [
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full',
      },
      {
        path: 'inventory',
        component: StoreInventoryComponent,
      },
    ],
  },
  {
    path: 'pet',
    component: PetComponent,
    children: [
      {
        path: '',
        redirectTo: 'status',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: PetCreateComponent,
      },
      {
        path: 'status',
        component: PetStatusComponent,
      },
      {
        path: 'tags',
        component: PetTagsComponent,
      },
    ],
  },
];
