import {Component, inject, Input} from '@angular/core';
import {Product} from '../../../Shared/Models/product';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {CurrencyPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {CartService} from '../../../Core/services/cart.service';

@Component({
  selector: 'app-product-item',
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    MatIcon,
    MatButton,
    RouterLink
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
@Input() product?:Product;
cartService=inject(CartService);

}
