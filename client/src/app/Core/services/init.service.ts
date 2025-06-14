import {inject, Injectable} from '@angular/core';
import {CartService} from './cart.service';
import {forkJoin, of} from 'rxjs';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  cartService = inject(CartService);
  accountService = inject(AccountService);

  init() {
    const cartId = localStorage.getItem('cart_id');
    let cart$ = cartId ? this.cartService.getCart(cartId) : of(null);
    return forkJoin({

      cart: cart$,
      user: this.accountService.getUserInfo()
    })
  }
}
