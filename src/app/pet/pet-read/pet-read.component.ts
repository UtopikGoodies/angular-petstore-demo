import { Component } from '@angular/core';
import { FormPetCruComponent } from '../form-pet-cru/form-pet-cru.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pet-read',
  standalone: true,
  imports: [FormPetCruComponent],
  templateUrl: './pet-read.component.html',
  styleUrl: './pet-read.component.scss',
})
export class PetReadComponent {
  pageTitle = 'Pet';
  petId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.petId = params['id'];
      this.pageTitle += ` #${this.petId}`;
    });
  }
}
