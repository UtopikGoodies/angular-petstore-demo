import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Pet } from '@utopikgoodies/swagger-petstore-client';
import { Router } from '@angular/router';
import { DynamicFormService } from '../../dynamic-form.service';

@Component({
  selector: 'app-pet-status',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pet-status.component.html',
  styleUrl: './pet-status.component.scss',
})
export class PetStatusComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageTitle = 'Pet';

  pets: Pet[] = [];

  dataSource: MatTableDataSource<{ [key: string]: unknown }> =
    new MatTableDataSource();
  displayedColumns: string[] = [];
  resultsLength = 0;

  statuses!: Pet.StatusEnum;

  selected = new FormControl(Pet.StatusEnum.Available);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dynamicFormService: DynamicFormService
  ) {
    this.loadData();
    this.selected.valueChanges.subscribe({
      next: (value) => this.loadData(value as Pet.StatusEnum),
      error: (err) => console.error(err),
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(status: Pet.StatusEnum | undefined = this.selected.value as Pet.StatusEnum) {
    this.apiService.petService.findPetsByStatus(status).subscribe({
      next: (value) => {
        this.pets = value;
        this.dataSource.data = value.map((pet) => {
          return {
            ...pet,
            category: pet.category?.name,
            tags: pet.tags?.map((tag) => {
              return tag.name;
            }),
          };
        });
      },
      error: (error) => console.error(error),
      complete: () => {
        console.info('Pets data loaded.');
        this.displayedColumns = Object.keys(this.dataSource.data[0]);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isRequired<T>(property: T | null): boolean {
    return property !== null;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  openPetDialog(petId: string) {
    const pet = this.pets.find(pet => pet.id === Number(petId));
    if (pet) {
      this.dynamicFormService.openPetDialog(pet).subscribe({
        next: (value) => console.debug(value),
        error: (error) => console.error(error),
        complete: () => {
          this.loadData();
        },
      });
    }
  }
}
