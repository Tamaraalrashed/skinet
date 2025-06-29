import {Component, inject, OnInit, output} from '@angular/core';
import {CheckoutService} from '../../../Core/services/checkout.service';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../../Core/services/cart.service';
import {map} from 'rxjs';
import {DeliveryMethod} from '../../../Shared/Models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit() {
    this.checkoutService.getDeliveryMethods()?.subscribe({
      next: methods => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
          if (method) {
            this.cartService.selectedDeliveryMethod.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      }
    })
  }

  updateDeliveryMethod(method: DeliveryMethod) {
    this.cartService.selectedDeliveryMethod.set(method);
    const cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
      this.deliveryComplete.emit(true);
    }
  }
}
