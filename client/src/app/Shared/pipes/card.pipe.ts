import { Pipe, PipeTransform } from '@angular/core';
import {ConfirmationToken} from '@stripe/stripe-js';

@Pipe({
  name: 'paymentCard'
})
export class CardPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'], ...args: unknown[]): unknown {
    if(value?.card ) {
      const {last4,brand,exp_month,exp_year}=value.card;
      return `${brand.toUpperCase()}**** **** **** ${last4}, Exp: ${exp_month }/${exp_year}`;
    }
return 'Unknown payment method';
}
}
