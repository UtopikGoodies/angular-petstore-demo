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

interface Status {
  value: 'available' | 'pending' | 'sold';
  viewValue: string;
}

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

  dataSource: MatTableDataSource<{ [key: string]: unknown }> =
    new MatTableDataSource();
  displayedColumns: string[] = [];
  resultsLength = 0;

  statuses: Status[] = [
    { value: 'available', viewValue: 'Available' },
    { value: 'pending', viewValue: 'Pending' },
    { value: 'sold', viewValue: 'Sold' },
  ];

  selected = new FormControl(this.statuses[0].value);

  constructor(public dialog: MatDialog, private apiService: ApiService) {
    this.loadData(
      this.statuses.find((status) => status.value === this.selected.value)
    );
    this.selected.valueChanges.subscribe({
      next: (value) =>
        this.loadData(this.statuses.find((status) => status.value === value)),
      error: (err) => console.error(err),
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(status: Status | undefined) {
    // Call the API service to retrieve pet data based on the provided status.
    this.apiService.petService.findPetsByStatus(status?.value).subscribe({
      next: (value) => {
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
        // After data is loaded, update the displayed columns for the table.
        console.info('Pets data loaded.');
        // Get the keys (column names) from the first item in the data source.
        this.displayedColumns = Object.keys(this.dataSource.data[0]);
      },
    });
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
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
    min = Math.ceil(min); // Round up the minimum value
    max = Math.floor(max); // Round down the maximum value
    return Math.floor(Math.random() * (max - min + 1)) + min; // Inclusive of min and max
  }
}
