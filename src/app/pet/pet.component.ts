import { ApiService } from '../api.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Pet } from '@utopikgoodies/swagger-petstore-client';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.scss',
})
export class PetComponent implements OnInit {
  dataSource: MatTableDataSource<Pet> = new MatTableDataSource();
  displayedColumns: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.petService.findPetsByStatus('available').subscribe({
      next: (value) => {
        this.dataSource.data = value;
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
  }
}
