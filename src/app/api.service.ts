import { Injectable } from '@angular/core';
import { PetService, UserService, StoreService } from "@utopikgoodies/swagger-petstore-client";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public petService: PetService,
    public userService: UserService,
    public storeService: StoreService
  ) {
    petService.configuration.basePath = "https://petstore3.swagger.io/api/v3";
    userService.configuration.basePath = "https://petstore3.swagger.io/api/v3";
    storeService.configuration.basePath = "https://petstore3.swagger.io/api/v3";
  }
}
