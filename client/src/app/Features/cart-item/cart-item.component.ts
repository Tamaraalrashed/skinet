import {Component, inject, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CartItem} from '../../Shared/Models/Cart';
import {MatButton, MatIconButton} from '@angular/material/button';
import {CurrencyPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {CartService} from '../../Core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink,
    MatIconButton,
    MatIcon,
    CurrencyPipe,
    MatButton

  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
item=input.required<CartItem>();
cartService=inject(CartService);

incrementQuantity(){
  this.cartService.addItemToCart(this.item());
}

decrementQuantity(){
  this.cartService.removeItemFromCart(this.item().productId,1);
}
removeItemFromCart(){
  this.cartService.removeItemFromCart(this.item().productId,this.item().quantity);
}

}
