import {Component, inject, Input} from '@angular/core';
import {CartService} from '../../../Core/services/cart.service';
import {CurrencyPipe} from '@angular/common';
import {ConfirmationToken} from '@stripe/stripe-js';
import {AddressPipe} from '../../../Shared/pipes/address.pipe';
import {CardPipe} from '../../../Shared/pipes/card.pipe';

@Component({
  selector: 'app-checkout-review',
  imports: [
    CurrencyPipe,
    AddressPipe,
    CardPipe
  ],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {
  cartService = inject(CartService);
@Input() confirmationToken?: ConfirmationToken;
}
