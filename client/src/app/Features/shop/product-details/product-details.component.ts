import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShopService} from '../../../Core/services/shop.service';
import {Product} from '../../../Shared/Models/product';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    MatIcon
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
private activatedRoute=inject(ActivatedRoute);
private shopService=inject(ShopService);
product?:Product;
  ngOnInit(){
    this.loadProduct();
  }
  loadProduct(){
    const id=this.activatedRoute.snapshot.paramMap.get('id');
if(!id) return;
    this.shopService.getProduct(+id).subscribe({
  next: response =>this.product=response,
});
  }

}
