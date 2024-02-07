import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-pet-tags',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pet-tags.component.html',
  styleUrl: './pet-tags.component.scss',
})
export class PetTagsComponent implements OnInit {
  dataSource: MatTableDataSource<{ [key: string]: unknown }> =
    new MatTableDataSource();
  displayedColumns: string[] = [];

  inputTags = new FormControl('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.inputTags.valueChanges.subscribe({
      next: (value) => this.loadData(value?.split(',')),
      error: (err) => console.error(err),
    });
  }

  loadData(tags: string[] | undefined) {
    // Call the API service to retrieve pet data based on the provided status.
    this.apiService.petService.findPetsByTags(tags).subscribe({
      next: (value) => {
        // Map and transform the retrieved pet data.
        this.dataSource.data = value.map((pet) => {
          // If the pet has a category, replace it with its name property.
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
