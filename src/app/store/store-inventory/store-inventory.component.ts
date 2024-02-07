import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatTableModule } from "@angular/material/table";
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-store-inventory',
  standalone: true,
  imports: [MatTableModule, TitleCasePipe],
  templateUrl: './store-inventory.component.html',
  styleUrl: './store-inventory.component.scss'
})
export class StoreInventoryComponent implements OnInit {
  dataSource: { status: string; quantity: number; }[] = []
  displayedColumns: string[] = ['status', 'quantity']

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.storeService.getInventory().subscribe({
      next: (value) => { 
        this.dataSource = Object.entries(value).map(([key, value]) => ({ "status": key, "quantity": value }));
      },
      error: (error) => console.error(error),
      complete: () => {
        console.info("Inventory data loaded.");
        console.debug(`${JSON.stringify(this.dataSource)}`); // Use JSON.stringify to log the dataSource as an object
      }
    })
  }
}